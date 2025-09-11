<script setup lang="ts">

import { ElDialog, ElDivider, ElTag, ElInput } from "element-plus";
import { ref, watch,onMounted, computed } from "vue";
import { cellProps,Tag } from "@/utils/type.ts";
import IconContainer from "@/components/Container/IconContainer.vue";
import {useResourceCondition} from "@/pinia/ResourceCondition.ts";
import {Util} from "@/utils";
import TagClassSelect from "@/components/Application/ResourceFolder/ShowTable/TagClassSelect.vue";


const emit = defineEmits(['close'])
const props = defineProps<cellProps>()
// 资源管理器pinia实例
const resFolder = useResourceCondition()
// 父元素的属性
const { top, left, height, width } = props.rect;
// 关闭遮罩
const dialogVisible = ref(props.dialogVisible)




// tag分割与合并
const tagSplit = (tag?: string | null) => {
  if (!tag) return []
  return tag.split(/[,，]/) .map(t => t.trim()).filter(t => t.length > 0) // 过滤掉空字符串
}
const tagJoin = (tags: string[], separator: string = ',') => {
  return tags.map(t => t.trim()).filter(t => t.length > 0).join(separator)
}
const getTagString = () => tagJoin(tagList.value, ',')
// 输入tag
const input = ref('')
// tag数组
const tagList = ref(tagSplit(props.data.tag))
const tagStore = ref<Tag[]>([]);
const tagSave = ref<Tag[]>([]);
const tagFilter = computed(() => {
  return tagStore.value.filter(tag => tag.name.includes(input.value));
});
// 用于记录当前悬停的标签索引
const tagHovered = ref<number | null>(null);



function handleInputEnter() {
  tagList.value.push(input.value)
  tagStore.value.push({name:input.value, class: '', connected_workspace: 1})
  input.value = ''
}
function handleTagClose(tag: any) {
  tagList.value.splice(tagList.value.indexOf(tag), 1)
  tagStore.value.splice(tagList.value.indexOf(tag), 1)
}
const handleTagClass = (event: MouseEvent) => {
  const h = event.target as HTMLElement;
  const parentElement = h.parentElement;
  console.log(parentElement);
  if (parentElement) {
    const rect = parentElement.getBoundingClientRect();
    console.log(rect);
    Util.openComponent(TagClassSelect, 'classSelect', { dialogVisible: true, rect: rect });
  }
}
const handleTagSelect = () => {
  console.log('TagSelect')
}
// 处理鼠标进入事件
const handleTagEnter = (index: number) => {
  tagHovered.value = index; // 设置当前悬停的标签索引
}
// 处理鼠标离开事件
// const handleTagLeave = (index: number) => {
//   if (tagHovered.value === index) {
//     tagHovered.value = null; // 恢复默认状态
//   }
// }

const handleTagDrag = () => {

}


// 将input输入的单个string转换为可保存格式
const listTransSave = (tag: string) => {
  const transformedTag: Tag = {
    name: tag,  // 标签名称
    class: '',  // 默认空class，或可以根据需要赋值
    connected_workspace: 1,  // 默认工作空间ID，可以动态传值
  };
  // 将转换后的标签推送到 tagSave
  tagSave.value.push(transformedTag);
}
// const confirmUpdate = (tag: string) => {

// }
// 数据库交互，存储或是更新tag
const saveOrUpdateTags = async (tags: Tag[]) => {
  // 准备插入和更新的 SQL 语句
  const insertSQL = `INSERT INTO tag (name, class, connected_workspace) VALUES (?, ?, ?);`
  const updateSQL = `UPDATE tag SET class = ?, connected_workspace = ? WHERE name = ?;`

  // 使用事务来保证批量插入的原子性
  await window.electronAPI.dataOperation.execute(`BEGIN TRANSACTION;`)

  try {
    for (let tag of tags) {
      // 检查标签是否已经存在
      const existingTag = await window.electronAPI.dataOperation.queryAll(
          `SELECT * FROM tag WHERE name = ? AND class = ?;`,
          [tag.name, tag.class]
      );

      if (existingTag.length > 0) {
        // 如果标签已存在，更新标签信息
        await window.electronAPI.dataOperation.execute(
            updateSQL,
            [tag.class, tag.connected_workspace, tag.name]
        );
      }
      else {
        // 如果标签不存在，插入新标签
        await window.electronAPI.dataOperation.execute(
            insertSQL,
            [tag.name, tag.class, tag.connected_workspace]
        );
      }
    }

    // 提交事务
    await window.electronAPI.dataOperation.execute(`COMMIT;`);
    return { success: true, message: 'Tags processed successfully' };
  }
  catch (error) {
    // 如果出错，回滚事务
    await window.electronAPI.dataOperation.execute(`ROLLBACK;`);
    return { success: false, message: 'Error processing tags', error };
  }
};



watch(dialogVisible,  async (newVal) => {
  if (!newVal) {
    const tableName = props.data.type === 'folder' ? 'portfolio' : 'file';

    const result = await window.electronAPI.dataOperation.execute(
        `UPDATE ${tableName} SET tag = ? WHERE ID = ?;`,
        [getTagString(), props.data.id]
    );


    // 示例：逐一转换tagList中的每个标签
    tagList.value.forEach(tag => listTransSave(tag));
    await saveOrUpdateTags(tagSave.value);



    if (result) {
      emit("close")
      resFolder.setDataChange(result)
    }


  }
});



onMounted(async () => {
  tagStore.value = await window.electronAPI.dataOperation.queryAll(
      `SELECT * FROM tag WHERE connected_workspace = 1;`,
  );

});


</script>

<template>
  <teleport to="body">
    <el-dialog
        v-model="dialogVisible"
        :modal="false"
        :style="{ position: 'fixed', top: `${top}px`, left: `${left}px`, zIndex: 9999, height: `2${height}px`, width: `${2*width}px` }"
        :show-close="false">


      <template #default>
        <div class="dialog-content">
          <div class="dialog-content-title">
            <el-tag
              v-for="tag in tagList"
              :key="tag"
              class="dialog-content-title-tag"
              closable
              @close="handleTagClose(tag)"
              type="primary">
              {{ tag }}
            </el-tag>
            <el-input v-model="input" @keydown.enter="handleInputEnter" class="dialog-content-title-tag-input" placeholder="Enter Tag ..."/>
          </div>

          <el-divider></el-divider>

          <div class="dialog-content-option">
            <span class="dialog-content-option-text">当前工作空间的tag</span>
            <div class="dialog-content-option-list">

              <div
                  class="dialog-content-option-list-item"
                  v-for="(tag, index) of tagFilter"
                  @click="handleTagSelect"
                  @mouseenter="handleTagEnter(index)"
                  :class="{ 'hover': tagHovered === index }">
                <IconContainer :link-mode="false" name="tagMenu" @click.stop="handleTagDrag"/>
                <el-tag
                    :style="tag.class"
                    type="primary">
                  {{ tag.name }}
                </el-tag>
                <IconContainer
                    :link-mode="false"
                    name="more"
                    class="dialog-content-option-list-item-after"
                    @click.stop="handleTagClass($event)"/>
              </div>

              <div class="dialog-content-option-list-empty" v-if="tagFilter.length == 0">
                <span>当前没有标签，尝试添加新标签</span>
              </div>

            </div>
          </div>
        </div>
      </template>


    </el-dialog>
  </teleport>
</template>

<style scoped>


.dialog-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  align-items: center;
}
.dialog-content-title {
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 5px;
  column-gap: 10px;
  justify-content: start;
  align-items: center;
}
.dialog-content-title-tag {
  box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.1),  /* 较轻的阴影 */
      0 1px 4px rgba(0, 0, 0, 0.1);  /* 适中的模糊 */
}
.dialog-content-title-tag-input {
  flex: 1;
  min-width: 85px;
}




.dialog-content-option {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.dialog-content-option-list {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}
.dialog-content-option-list-empty {
  font-size: 13px;
  display: flex;
  flex: 1;
  width: 100%; /* 确保宽度填满父容器 */
  height: 100%; /* 确保高度填满父容器 */
  align-items: center;
  justify-content: center;
}
.dialog-content-option-text {
  font-size: 12px;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 5px;
}
.dialog-content-option-list-item {
  background-color: transparent;
  border-radius: 4px;
  height: 32px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  padding-left: 6px;
  gap: 12px;
}
.dialog-content-option-list-item:hover {
  background-color: #e0e0e0;
}
.dialog-content-option-list-item.hover {
  background-color: #e0e0e0; /* 略深于之前的灰色背景，增加悬浮时的可见度 */
  color: #333; /* 保持深灰色字体，确保清晰可读 */
  transition: background-color 0.3s ease, color 0.3s ease; /* 为背景色和文字颜色添加平滑过渡 */
}
.dialog-content-option-list-item-after {
  margin-left: auto;
  margin-right: 10px;
}





:deep(.el-input__wrapper) {
  padding: 0;
}

</style>