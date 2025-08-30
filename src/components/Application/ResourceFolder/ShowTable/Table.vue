<script setup lang="ts">
import {Data, Util} from "@/utils";
import {ElMessage, ElPopover, ElTable, ElTableColumn, ElTag, ElButton} from 'element-plus'
import {onMounted, ref, onUnmounted} from "vue";
import { VXETableNode } from "@/utils/type.ts";
import IconContainer from "@/components/Container/IconContainer.vue";
import ShowTableDialog from "@/components/Application/ResourceFolder/ShowTable/ShowTableDialog.vue";
import ExpandTag from "@/components/Application/ResourceFolder/ShowTable/ExpandTag.vue";
import ExpandName from "@/components/Application/ResourceFolder/ShowTable/ExpandName.vue";
import { useResourceCondition } from "@/pinia/ResourceCondition.ts";


const props = defineProps<{
  id: string;
}>()

const resFolder = useResourceCondition()
const tableData = ref<VXETableNode[]>([])
const proxy = ref<HTMLElement | null>(null)
let clickTimer: ReturnType<typeof setTimeout> | null = null;
const clickDelay = 200;
const hoverRow = ref<any>(null);
const hoverColumn = ref<string | null>(null);


const fields = ref([
  { key: 'name', label: 'Name', width: 180, minWidth: 200 },
  { key: 'tag', label: 'Tag', width: 140, minWidth: 160 },
])


const hover = ref([
  { label: '编辑', bool: false, icon: 'edit' },
  { label: '收藏', bool: false, icon: 'like' },
  { label: '删除', bool: false ,icon: 'remove'},
])



const handleDragend =  (newWidth: number, oldWidth: number, column: any) => {
  // 设置最小宽
  console.log(newWidth, oldWidth, column);
  column.width = newWidth < column?.minWidth ? column.minWidth : column.width = newWidth
}
const handleCellClick = (row: any, column: any, cell: any) =>  {
  // 如果存在延时计时器，先清除
  if (clickTimer) clearTimeout(clickTimer);

  // 延时触发单击事件
  clickTimer = setTimeout( () => {
    clickTimer = null; // 执行完毕后清空计时器
    ElMessage({
      message: `单击事件触发: ${row.name}`,
      type: 'primary', // 这里设置消息类型，可改为 'success'/'warning'/'error'
      duration: 3000,
    });

    const rect = cell.getBoundingClientRect();

    if (column.property === 'tag') {

      Util.openComponent(ExpandTag, 'id', { dialogVisible: true, rect: rect, data: row, id: props.id });
    }
    else if (column.property === 'name') {
      Util.openComponent(ExpandName, 'id', {dialogVisible: true, rect: rect, data: row, id: props.id });
    }




  }, clickDelay);
};
const handleCellDblClick = async (row: any, column: any, cell: any) => {
  // 双击时清除单击延时
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }

  ElMessage({
    message: `双击事件触发: ${row.name}`,
    type: 'success', // 这里设置消息类型，可改为 'success'/'warning'/'error'
    duration: 3000,
  });


  console.log(row.id, row.type)


  Util.openComponent(ShowTableDialog, 'id', {dialogVisible: true, cellId: row.id, type: row.type});
  tableData.value = await window.electronAPI.dataOperation.loadTable(1)

  if (column.property === 'tag') {
    console.log('点击了tag')
    console.log(cell, row, column)
  }

};
const handleCellHover = (row: any, column: any) => {
  hoverRow.value = row;
  hoverColumn.value = column.key;
}
const handleCellLeave = () => {
  hoverRow.value = null;
  hoverColumn.value = null;
}

const tagSplit = (tag?: string | null) => {
  if (!tag) return []
  return tag.split(/[,，]/) .map(t => t.trim()).filter(t => t.length > 0) // 过滤掉空字符串
}


const stop = resFolder.$subscribe(async (mutation, state) => {
  console.log(mutation, state);
  resFolder.setDataChange(1)
  tableData.value = await window.electronAPI.dataOperation.loadTable(1)
})




onMounted( async () => {
  tableData.value = await window.electronAPI.dataOperation.loadTable(1)
  proxy.value = document.querySelector<HTMLDivElement>('.el-table__column-resize-proxy');
})

onUnmounted(() => stop())






</script>

<template>
  <div style="display: flex; flex-direction: column; height: 100%;">
    <el-table
        border
        :data="tableData"
        height="250"
        style="flex: 1;
        min-height: 0;"
        @header-dragend="handleDragend"
        @cell-mouse-enter="handleCellHover"
        @cell-mouse-leave="handleCellLeave"
        @cell-click="handleCellClick"
        @cell-dblclick="handleCellDblClick">

      <el-table-column type="index" label="Id" :index="index => index" align="center" width="60" :resizable="false"></el-table-column>

      <el-table-column v-for="item of fields" :prop="item.key" :label="item.label" :width="item.width" :min-width="item.minWidth" :resizable="true">
        <template #expand>dsa</template>

        <template #default="table">

          <div style="display: flex; flex-direction: row; align-items: center; gap: 6px; width: 100%;">

            <template v-if="item.key === 'name' " >
              <IconContainer :link-mode="true" :file-type="table.row.type"></IconContainer>
              <span class="ellipsis">{{ table.row[item.key] }}</span>
            </template>


            <template v-else-if="item.key === 'tag' ">
              <div class="tag-container">
                <el-tag
                    v-for="tag in tagSplit(table.row[item.key])"
                    :key="tag"
                    class="tag-item"
                    type="primary">
                  {{ tag }}
                </el-tag>
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

        <template #default="button">
          <div class="edit-icon" v-show="hoverRow === button.row && hoverColumn === button.key">
            <el-button
                v-for="i of hover"
                class="hover-btn"
                @mouseenter="i.bool = true"
                @mouseleave="i.bool = false">
              <IconContainer :link-mode="false" :name="i.icon" />
              <span class="btn-text" v-show="i.bool">{{ i.label }}</span>
            </el-button>
          </div>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<style scoped>



/* 省略号效果 */
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-container {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tag-item + .tag-item {
  margin-left: 5px;
}


.edit-icon {
  position: relative;       /* 脱离文档流 */
}

.btn-text{
  margin-left: 4px;
  margin-right: 4px;
  color: black;
  font-size: 14px;
}

.hover-btn {
  border: 1px solid rgba(255, 255, 255, 0.6); /* 半透明白色，玻璃感 */
  height: 26px;
  min-width: 26px;          /* 保证按钮最小宽度是圆形 */
  align-items: center;
  padding: 0;
  margin-top: 7px;
  margin-bottom: 7px;
  border-radius: 50%;
  overflow: hidden;         /* 裁掉多余内容 */

  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(6px);

  /* 分层阴影：下方硬阴影 + 柔光晕 */
  box-shadow:
      0 1px 3px rgba(0,0,0,0.3),
      0 2px 6px rgba(0,0,0,0.15);
  transition: border-radius 0.15s ease, width 0.15s ease 0.15s,
  background 0.3s ease, box-shadow 0.3s ease;
}

.hover-btn:hover {
  border: 1px solid rgba(255, 255, 255, 0.6); /* 半透明白色，玻璃感 */
  max-width: 100px;          /* 展开 */
  border-radius: 4px;      /* 圆角矩形 */
  box-shadow:
      0 1px 3px rgba(0,0,0,0.3),
      0 2px 6px rgba(0,0,0,0.15);
}

.hover-btn:active {
  background: rgba(255, 255, 255, 0.2);
  /* 按下去阴影更贴近，减少扩散 */
  box-shadow:
      0 1px 3px rgba(0,0,0,0.3),
      0 2px 6px rgba(0,0,0,0.15);
  transform: translateY(1px); /* 模拟压下去 */
}







:deep(.el-table) {
  background: rgba(255, 255, 255, 0.4);
  box-shadow:
      0 8px 20px rgba(0, 0, 0, 0.35),
      0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}
/* 表头 hover 效果 */
:deep(.el-table__header th:not(:last-child, :first-child):hover) {
  background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(240,240,240,0.9));
  backdrop-filter: blur(6px);
  color: #333;
  font-weight: 600;
  transition: background 0.25s ease, color 0.25s ease;
}
:deep(.el-table__header th:not(:last-child, :first-child):active) {
  transform: translateY(1px) scale(0.98);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  background-color: #e9ecf1;
}
/* 表体单元格 hover，排除第一列和最后一列 */
:deep(.el-table__body-wrapper td:not(:first-child, :last-child):hover) {
  background-color: #e6f7ff !important; /* 浅蓝色背景 */
  cursor: pointer;
  /* 柔和的蓝色框选效果 */
  outline: 1px solid #91d5ff;
  outline-offset: -1px; /* 确保描边在单元格内部 */
  transition: all 0.2s ease;
}
/* 表体单元格点击效果 */
:deep(.el-table__body-wrapper td:not(:first-child, :last-child):active) {
  background-color: #bae7ff !important; /* 更深的蓝色背景 */
  outline: 2px solid #40a9ff;
  outline-offset: -2px;
  transform: none;
  box-shadow: none;
}

:deep(.el-table__body td:last-child) {
  padding: 0 !important;
}


</style>