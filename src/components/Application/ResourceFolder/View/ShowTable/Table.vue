<script setup lang="ts">
import {Data, Util} from "@/utils";
import { ElPopover, ElTable, ElTableColumn, ElTag } from 'element-plus'
import {onMounted, ref, onUnmounted} from "vue";
import { VXETableNode } from "@/utils/type.ts";
import IconContainer from "@/components/Container/IconContainer.vue";
import ExpandTag from "@/components/Application/ResourceFolder/View/ShowTable/ExpandTag.vue";
import ExpandName from "@/components/Application/ResourceFolder/View/ShowTable/ExpandName.vue";
import { useResourceCondition } from "@/pinia/ResourceCondition.ts";


const props = defineProps<{
  id: string;
}>()

// 资源管理器pinia实例
const resFolder = useResourceCondition()
console.log(resFolder.currentFolder, resFolder.currentSpace)
// table数据
const tableData = ref<VXETableNode[]>([])
// 拖拽条实例获取
const proxy = ref<HTMLElement | null>(null)
// 单双击区分
let clickTimer: ReturnType<typeof setTimeout> | null = null;
const clickDelay = 200;

const tagStore = ref()
// 表头字段数据
const fields = ref([
  { key: 'name', label: 'Name', width: 180, minWidth: 100 },
  { key: 'tag', label: 'Tag', width: 140, minWidth: 100 },
])


// tag分割
const tagSplit = (tag?: string | null) => {
  if (!tag) return []
  return tag.split(/[,，]/) .map(t => t.trim()).filter(t => t.length > 0) // 过滤掉空字符串
}

const tableLoad = async () => {
  if (resFolder.currentFolder === -1) {
    tableData.value = await window.electronAPI.dataOperation.loadTable(resFolder.currentSpace);
  }
  else {
    tableData.value = await window.electronAPI.dataOperation.loadTable(resFolder.currentSpace, resFolder.currentFolder);
  }
  tableData.value = tableData.value.map(row => {
    return {
      ...row, // 1. 复制所有原有属性
      tags: tagSplit(row.tag) // 2. 获取 'tag' 键的值并进行处理
    };
  });
}

// 拖拽条拖拽最小列宽
const handleDragend =  (newWidth: number, _oldWidth: number, column: any) => {
  // 设置最小宽
  column.width = newWidth < column?.minWidth ? column.minWidth : column.width = newWidth
}

// 单元格单击
const handleCellClick = (row: any, column: any, cell: any) =>  {
  // 如果存在延时计时器，先清除
  if (clickTimer) clearTimeout(clickTimer);

  // 延时触发单击事件
  clickTimer = setTimeout( () => {
    clickTimer = null; // 执行完毕后清空计时器

    const rect = cell.getBoundingClientRect();

    if (column.property === 'tag') {
      Util.openComponent(ExpandTag, 'id', { dialogVisible: true, rect: rect, data: row, id: props.id });
    }
    else if (column.property === 'name') {
      Util.openComponent(ExpandName, 'id', {dialogVisible: true, rect: rect, data: row, id: props.id });
    }
    else {
    }
  }, clickDelay);
};
// 单元格双击
const handleCellDblClick = async (row: any, column: any, _cell: any) => {
  // 双击时清除单击延时
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }

  if (column.property === 'name') {
    if (row.type === 'folder'){
      resFolder.setFolderChange(row.id)
    }
    else {
      await window.electronAPI.openFile(row.file_path)
    }

  }
};





// 停止state订阅
const stop = resFolder.$subscribe(async (_mutation, _state) => {
  await tableLoad()
})




onMounted( async () => {
  await tableLoad()
  proxy.value = document.querySelector<HTMLDivElement>('.el-table__column-resize-proxy');

  tagStore.value = await window.electronAPI.dataOperation.queryAll(`SELECT * FROM tag WHERE connected_workspace = 1;`);
})

onUnmounted(
    () => stop()
)






</script>

<template>
  <div style="display: flex; flex-direction: column; height: 100%; will-change: auto">
    <el-table
        border
        :data="tableData"
        style="flex: 1;
        min-height: 0;"
        @header-dragend="handleDragend"
        @cell-click="handleCellClick"
        @cell-dblclick="handleCellDblClick">

      <el-table-column  label="Id" :index="index => index" align="center" width="60" :resizable="false" type="expand" >
      </el-table-column>

      <el-table-column
              v-for="item of fields"
              :prop="item.key"
              :label="item.label"
              :width="item.width"
              :min-width="item.minWidth"
              @mousedown="console.log('dsa1111111111')"
              :resizable="true">

            <template #default="table">
              <div class="table-column">

                <template v-if="item.key === 'name' " >
                  <div class="table-column-name">
                    <IconContainer :link-mode="true" :file-type="table.row.type"></IconContainer>
                    <span class="table-column-name-ellipsis">{{ table.row[item.key] }}</span>
                  </div>
                </template>

                <template v-else-if="item.key === 'tag' ">
                  <div class="table-column-tag">
                    <el-tag
                        v-if="table.row.tags.length > 0"
                        class="dialog-content-title-tag-item dialog-content-title-tag-self"
                        type="primary">
                      {{ table.row.tags[0] }}
                    </el-tag>
                    <IconContainer v-if="table.row.tags.length > 1" :link-mode="false" name="more"/>
                  </div>
                </template>

                <template v-else>
                  <span class="">{{ table.row[item.key] }}</span>
                </template>

              </div>
            </template>

      </el-table-column>

      <el-table-column label="" prop="default" align="right" header-align="left">

            <template #header>
              <el-popover placement="left-end" >
                <template #reference>
                  <div>+</div>
                </template>
                <template #default>
                  <div class="context-menu" ref="container">
                    <div class="context-menu-item" v-for="item of Data.headData">{{item.label}}</div>
                  </div>
                </template>
              </el-popover>
            </template>

          </el-table-column>


    </el-table>
  </div>
</template>

<style scoped>


.table-column {
  margin: auto;
}
.table-column-name {
  display: flex;
}
.table-column-name-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.table-column-tag {
  display: flex;
  align-items: center;
  justify-content: space-between;
}



.dialog-content-title-tag-item {
  margin-left: 5px;
}
.dialog-content-title-tag-item:not(:first-child) {
  display: none;
}
.dialog-content-title-tag-self {
  color: black;
  background: whitesmoke;
  border: #1d4ed8 solid 1px;
}



/* 表体单元格 hover，排除第一列和最后一列 */
:deep(.el-table__body-wrapper td:not(:first-child, :last-child):hover) {
  background-color: rgba(0, 0, 0, 0.1) !important;
  cursor: pointer;
  outline-offset: -2px; /* 确保描边在单元格内部 */
  transition: all 0.2s ease;
}




</style>