<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {Component, Data, Util } from "@/utils";
import { ElPopover } from 'element-plus'
import {ElTreeNode, VXETableNode} from "@/utils/type.ts";
import {useTreeCondition} from "@/pinia/TreeCondition.ts";
import IconContainer from "@/components/Container/IconContainer.vue";

import MenuContainerV1 from "@/components/Container/MenuContainerV1.vue";
import ContextMenuV1 from "@/components/Menu/ContextMenuV1.vue";


const store = useTreeCondition()
const tableData = ref<VXETableNode[]>([])
const alignOrder = ['left', 'center', 'right']

const Fields = ref([
  { key: 'name', label: '名称', width: 180, align: 'left'},
  { key: 'type', label: '类型', width: 140, align: 'center'},
  { key: 'create_time', label: '创建时间', width: 160, align: 'center'},
])


async function fieldContext(e: MouseEvent, index: any) {
  const data = [
    {label: '对齐', key: 'align', disabled: false},
      { label: '属性', key: 'distribution' ,disabled: false},
      { label: '删除', key: 'delete', disabled: false},
  ]

  if (Fields.value[index].key === 'name') {
    data.find(i => i.key === 'delete')!.disabled = true
  }

  const result = await Util.asyncOpenComponent(ContextMenuV1, data[index].key,{
    x:e.x,
    y:e.y,
    data: data,
    title: Fields.value[index].key
  })



  if (result && result.key === 'delete') {
    if (Fields.value[index].key === 'name') {
      return
    }
    Fields.value.splice(index, 1)  // 删除字段
  }
  if (result && result.key === 'align'){
    const current = Fields.value[index]
    const i = alignOrder.indexOf(current.align)
    current.align = alignOrder[(i + 1) % alignOrder.length]
  }
}

// 表格初始化
const initData = async () => {
  tableData.value = await window.electronAPI.dataOperation.loadTable(store.currentWorkspace, store.currentFolder)
}

function itemClick(item: any) {
  if (!Fields.value.some(f => f.key === item.key)) {
    Fields.value.push(item)
  }
}
function isClicked(item: any) {
  return Fields.value.some(f => f.key === item.key)
}



const cellClick = async (row: ElTreeNode, key:string) => {
  if (key === 'name') {
    if (row.type !== 'folder'){
      console.log('打开文件')
      await window.electronAPI.openFile(row.file_path as string)
    }
    else {
      console.log('设置文件夹')
      store.setCurrentFolder(row.id)
    }
  }
}




function saveWidths() {
  const widths = Object.fromEntries(Fields.value.map(f => [f.key, f.width]))
  localStorage.setItem('table-field-widths', JSON.stringify(widths))
}
// 读取列宽
function loadWidths() {
  const saved = localStorage.getItem('table-field-widths')
  if (saved) {
    const widths = JSON.parse(saved)
    Fields.value.forEach(f => {
      if (widths[f.key]) f.width = widths[f.key]
    })
  }
}

// function startResize(e: MouseEvent, index: number) {
//   const startX = e.clientX
//   const startWidth = Fields.value[index].width
//
//   const onMouseMove = (moveEvent: MouseEvent) => {
//     const delta = moveEvent.clientX - startX
//     Fields.value[index].width = Math.max(112, startWidth + delta)
//   }
//
//   const onMouseUp = () => {
//     window.removeEventListener('mousemove', onMouseMove)
//     window.removeEventListener('mouseup', onMouseUp)
//
//     saveWidths()  // 保存列宽
//   }
//
//   window.addEventListener('mousemove', onMouseMove)
//   window.addEventListener('mouseup', onMouseUp)
// }

function startResize(e: MouseEvent, index: number) {
  const startX = e.clientX
  const startWidth = Fields.value[index].width

  let newWidth = startWidth

  // 节流标记
  let ticking = false

  const onMouseMove = (moveEvent: MouseEvent) => {
    const delta = moveEvent.clientX - startX
    newWidth = Math.max(112, startWidth + delta)

    if (!ticking) {
      window.requestAnimationFrame(() => {
        Fields.value[index].width = newWidth
        ticking = false
      })
      ticking = true
    }
  }

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)

    saveWidths()
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}



watch(() => [store.currentFolder, store.currentWorkspace], async () => {
  if (store.currentFolder === -1) {
     tableData.value = await window.electronAPI.dataOperation.loadTable(store.currentWorkspace)
  }
  else {
    await initData()
  }
})


store.$subscribe(async(mutation, _state) => {
  const events = mutation.events

  if ((Array.isArray(events) && events.some(e => e.key === 'changedState')) || (!Array.isArray(events) && events.key === 'changedState')) {
    tableData.value = await window.electronAPI.dataOperation.loadTable(store.currentWorkspace)
    store.setChangedState(-1)
  }
})



onMounted( async () => {
  tableData.value = await window.electronAPI.dataOperation.loadTable(store.currentWorkspace)
  loadWidths()
})




</script>

<template>
  <div class="table-container">
      <div class="table-container-head">
        <div class="table-container-head-item"></div>
        <div class="table-container-head-item"
             v-for="(item,index) of Fields"
             @contextmenu.stop.prevent="fieldContext($event, index)"
             :style="{ width: item.width + 'px' }">
          <div class="table-container-head-item-cell">{{item.label}}</div>
          <div class="table-container-head-item-resizeHandle" @mousedown.stop.prevent="startResize($event, index)"></div>
        </div>
        <div class="table-container-head-fill">
          <el-popover placement="right-end" >
            <template #reference>
              <div class="table-container-head-menu">+</div>
            </template>
            <template #default>
              <div class="context-menu" ref="container">
                <div class="context-menu-item" v-for="item of Data.headData" @click="itemClick(item)" :class="{ disabled: isClicked(item) }">{{item.label}}</div>
              </div>
            </template>
          </el-popover></div>
      </div>
      <div class="table-container-body">
        <div class="table-container-body-row" v-for="(row, index) of tableData">
          <div class="table-container-body-row-cell">{{ index+1 }}</div>
          <div class="table-container-body-row-cell"
               v-for="item of Fields"
               :style="{ width: item.width + 'px' }"
               :class="'align-' + item.align"
               @dblclick="cellClick(row as any, item.key)">
            <template v-if="item.key === 'name'">
              <IconContainer :file-type="row.type" :link-mode="true"></IconContainer>
              <span>{{ row[item.key] }}</span>
            </template>
            <template v-else-if="item.key === 'create_time'">
              {{ Util.formatter.timeFormatter(Number(row[item.key])) }}
            </template>
            <template v-else>
              {{ (row as any)[item.key] }}
            </template>
          </div>
          <div class="table-container-body-row-fill"></div>
        </div>
        <div class="table-container-body-fill"></div>
      </div>
  </div>
</template>

<style scoped>
/* 样式：拖动手柄 */
.align-left {
  justify-content: flex-start !important;
}
.align-center {
  justify-content: center !important;
}
.align-right {
  justify-content: flex-end !important;
}
:deep(.svg-icon){
  margin-right: 10px;
}



.table-container {
  height: 100%;
  background: transparent;
  overflow: hidden;
  font-size: 14px;
  display: flex;
  flex-direction: column;
}

.table-container-head {
  background: transparent;
  min-height: 40px;
  display: flex;
  flex-direction: row;
  height: 40px;
  position: sticky;
  top: 0;
}
.table-container-head-item{
  position: relative;
  background: rgba(255, 255, 255, 0.4);
  padding: 10px;
  font-size: 15px;

  display: flex;
  justify-content: center;
  align-items: center;

  flex-shrink: 0;
}
.table-container-head-item:hover {
  background: rgba(0, 0, 0, 0.06);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1);
}
.table-container-head-item:active {
  transform: scale(0.95);
  background: rgba(0, 0, 0, 0.08);
}
.table-container-head-item:first-child{
  width: 40px;
  border-top-left-radius: 6px;
  min-width: 40px;
}
.table-container-head-item:last-child{
  border-top-right-radius: 6px;
}
.table-container-head-item-resizeHandle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  user-select: none;
  z-index: 10;
}
.table-container-head-menu{
  width: 40px;
  padding: 10px;
  font-size: 15px;

  display: flex;
  justify-content: center;
  align-items: center;
}
.table-container-head-menu:hover {
  background: rgba(0, 0, 0, 0.06);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1);
}
.table-container-head-fill{
  flex: 1;
  background: rgba(255, 255, 255, 0.4);
}

.table-container-body{
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  overflow-y: auto;
  overflow-x: hidden;
}
.table-container-body::-webkit-scrollbar {
  width: 6px;
}

.table-container-body-row{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;

  flex-wrap: nowrap; /* 防止换行 */
  align-items: stretch; /* 确保单元格高度自适应 */
}
.table-container-body-row:hover {
  background: rgba(0, 0, 0, 0.03);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1);
}
.table-container-body-fill{
  flex: 1;
  background: rgba(255, 255, 255, 0.3);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
.table-container-body-row-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;

  padding: 10px;
  position: relative;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  will-change: width;

}
.table-container-body-row-cell:first-child{
  width: 40px;
  min-width: 40px;
}
.table-container-body-row-fill{
  flex: 1;
  background: rgba(255, 255, 255, 0.3);
}
.table-container-body-row-cell:hover::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid rgba(0, 0, 0, 0.2); /* 较深的边框 */
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1); /* 轻微光晕 */
  background-color: rgba(0, 0, 0, 0.02); /* 微微深色背景 */
  pointer-events: none;
}




.context-menu {
  width: 100%;
  border-radius: 6px;
  padding-left: 4px;
  padding-right: 4px;
  font-size: 14px;
  user-select: none;
  z-index: 1000;
  transition: box-shadow 0.3s ease;
}
.context-menu-item {
  padding: 6px 6px 6px 10px;
  margin: 4px 0;
  border-radius: 3px;
  font-size: 13px;
  cursor: pointer;
  color: #000000;
  background: transparent;
  transition: background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
  user-select: none;
}
.context-menu-item:hover {
  background-color: #ebebeb; /* 浅灰色背景 */
  color: #000000; /* 保持文字颜色不变，或换成 #333 更柔和 */
}
.context-menu-item.disabled {
  background-color: #f0f0f0;
  color: #aaa;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
  font-style: italic;
}

</style>