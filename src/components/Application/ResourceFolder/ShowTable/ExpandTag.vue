<script setup lang="ts">

import {ElDialog, ElDivider, ElTag, ElInput} from "element-plus";
import { ref, watch} from "vue";
import { cellProps } from "@/utils/type.ts";
import IconContainer from "@/components/Container/IconContainer.vue";
import {useResourceCondition} from "@/pinia/ResourceCondition.ts";



const emit = defineEmits(['close'])
const props = defineProps<cellProps>()

const input = ref('')

const resFolder = useResourceCondition()

const { top, left, height, width } = props.rect;
const dialogVisible = ref(props.dialogVisible)



const tagSplit = (tag?: string | null) => {
  if (!tag) return []
  return tag.split(/[,，]/) .map(t => t.trim()).filter(t => t.length > 0) // 过滤掉空字符串
}

const tagJoin = (tags: string[], separator: string = ',') => {
  return tags.map(t => t.trim()).filter(t => t.length > 0).join(separator)
}

function handleInputEnter() {
  console.log(input.value)
  tagList.value.push(input.value)
  input.value = ''
  console.log(tagList)
}

function handleTagClose(tag: any) {
  console.log(tag)
  tagList.value.splice(tagList.value.indexOf(tag), 1)
}

const getTagString = () => tagJoin(tagList.value, ',')

const tagList = ref(tagSplit(props.data.tag))

watch(dialogVisible,  async (newVal) => {
  if (!newVal) {

    const tableName = props.data.type === 'folder' ? 'portfolio' : 'file';

    const result = await window.electronAPI.dataOperation.execute(
        `UPDATE ${tableName} SET tag = ? WHERE ID = ?;`,
        [getTagString(), props.data.id]
    );

    console.log(result);

    if (result) {
      emit("close")
      resFolder.setDataChange(result)
    }
  }
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
              <div class="dialog-content-option-list-item" v-for="i of 10">
                <IconContainer :link-mode="false" name="tagMenu"/>


                <el-tag
                    v-for="tag in tagSplit(props.data.tag)"
                    :key="tag"
                    type="primary">
                  {{ tag }}
                </el-tag>


                <IconContainer :link-mode="false" name="more" class="dialog-content-option-list-item-after"/>
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.dialog-content-option-list {
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
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
.dialog-content-option-list-item-after {
  margin-left: auto;
  margin-right: 10px;
}



:deep(.el-input__wrapper) {
  padding: 0;
}

</style>