<script setup lang="ts">
import {onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
import { useRoute } from 'vue-router'
import router from "@/router";

import { ArrowRight} from '@element-plus/icons-vue'


import { VxeTableEvents, VxeTableInstance } from "vxe-pc-ui/types/components/table";
import { VxeColumnPropTypes } from "vxe-pc-ui/types/components/column";
import { VXETableNode } from "@/utils/type.ts";



import ViewContainer from "@/components/Container/ViewContainer.vue";


import { ElTreeNode } from "@/utils/type.ts";
import { useTreeCondition } from "@/pinia/TreeCondition.ts";
import {Component, Data, Util} from "@/utils"
import TableContainer from "@/components/Container/TableContainer.vue";





const route = useRoute()
const store =useTreeCondition()
// 当前工作区的名称
// const currentWorkspaceTitle = ref('')
// 表格展示数据
const tableData = ref<VXETableNode[]>([])
const tableRef = ref<VxeTableInstance>()
// 筛选选项数组（用于生成下拉菜单）
const tabs = ref<any[]>([{type:'全部文件'}])
// 绑定el-tree实例
const treeRef = ref()
// 注解传入tree的data
const data = ref<ElTreeNode[]>([])
// 当前选中的筛选标签
let activeTab = reactive({type:'全部文件'})
// 下拉菜单可见状态
const dropdownVisible = ref(false)
// 响应式存储表格高度
const tableHeight = ref(0)
// 面包屑路径地址
const pathArray = ref<any[]>([])
// input过滤文本
const filterText = ref('')
// 默认加载动画为false
const isLoading = ref<boolean>(false);
// 设置警告弹窗
const hasAlerted = ref(false)
// 计时器
let timer: ReturnType<typeof setTimeout> | null = null
// 点击事件并设置双击间隔
const { handleClick } = Util.useHandleClick(200)
// el-tree props 配置
const defaultProps = {children: 'children', label: 'label', path: 'path',}
// v-for循环数据
const sections = Data.nodeData





// 表格数据加载
async function load() {
  try {
    isLoading.value = true
    data.value = await window.electronAPI.dataOperation.loadTree(store.currentWorkspace)
    isLoading.value = false
  } catch (err) {
    console.error('加载目录结构失败:', err)
    isLoading.value = false
  }
}
// 允许拖拽的情况
const allowDrop = (draggingNode: { data: ElTreeNode }, dropNode: { data: ElTreeNode }, dropType: 'prev' | 'inner' | 'next') => {
  // 给拖动节点添加高亮
  treeRef.value?.setCurrentKey(draggingNode.data.uniqueKey)
  if(draggingNode.data.uniqueKey == dropNode.data.uniqueKey) {
    return false
  }
  // if (dropType === 'inner' && dropNode.data.isLeaf) {
  //   return false
  // }
  return dropType
}
// 拖拽事件结束（未完成则返回未定义）
const end = (_draggingNode: { data: ElTreeNode }, dropNode: { data: ElTreeNode }, _e: any, _el:any) => {
  // 拖拽时间不允许，拖入节点为空
  if (!dropNode){
    if (!hasAlerted.value) {
      Component.openNotification({
        message: '禁止拖入',
        type: 'error',
        duration: 3000,
        position: "bottom-right"
      })
      hasAlerted.value = true
      setTimeout(() => {
        hasAlerted.value = false
      }, 3000)
    }
  }
}
// 拖拽事件完成
const drop = async (draggingNode: {data: ElTreeNode} , dropNode: {data: ElTreeNode}, _dropType: 'inner'|'prev'|'next', _event: DragEvent)=>{
  const tableName = draggingNode.data.isLeaf?'file':'portfolio'
  const parentId = dropNode.data.id === 0 ? null : dropNode.data.id;
  const result = await window.electronAPI.dataOperation.execute(
      `UPDATE ${tableName} SET associated_folder = ? WHERE ID = ?;`,
      [parentId,draggingNode.data.id]
  )
  // 更新成功
  if (result){
    // 通过pinia设置更新状态
    store.setChangedState(dropNode.data.id)
    await Util.setAndJump(dropNode.data.connected_workspace, dropNode.data.id!, router)
    return;
  }
}
// 节点展开
const expand = (data: ElTreeNode) => {
  // 展开的时候添加节点id
  if (data.uniqueKey && !store.expandedNode.includes(data.uniqueKey)) {
    store.expandedNode.push(data.uniqueKey)
  }
}
// 节点关闭
const collapse = (data: ElTreeNode) => {
  // 递归删除idList中的id，得到收起父节点，子节点直接关闭的效果
  const removeNodeAndChildren = (node: ElTreeNode) => {
    if (!node) return
    if (node.uniqueKey) {
      store.removeExpandedNode(node.uniqueKey)
    }
    if (node.children && node.children.length) {
      node.children.forEach(child => removeNodeAndChildren(child))
    }
  }
  removeNodeAndChildren(data)
}
// 页面弹窗
function contextmenu(e: MouseEvent, data: ElTreeNode) {
  e.preventDefault()
  // Component.openMenu({
  //   type: "contextMenu",
  //   props: {
  //     isLeaf: data.isLeaf,
  //     positionX: e.clientX,
  //     positionY: e.clientY,
  //     treeRef,
  //     data
  //   }
  // })

  treeRef.value?.setCurrentKey(data.uniqueKey)
}
// 快捷节点调用判断
function nodeClick(section: any){
  if (section.action === 'workChange') workChange()
}
// 工作空间切换
function workChange(){
  Component.openDialog({
    type: 'switch'
  })
}
// 单击事件处理
function onSingleClick(node:any) {
  console.log(node.data.uniqueKey)
  if(node.data.isLeaf) return

  node.expanded = !node.expanded

  if(node.expanded){
    if (node.data.uniqueKey && !store.expandedNode.includes(node.data.uniqueKey)) {
      store.addExpandedNode(node.data.uniqueKey)
    }
  }
  else {
    // 递归删除idList中的id，得到收起父节点，子节点直接关闭的效果
    const removeNodeAndChildren = (data: ElTreeNode) => {
      if (!data) return
      if (data.uniqueKey && !data.isLeaf && store.expandedNode.includes(data.uniqueKey)) {
        store.removeExpandedNode(data.uniqueKey)
      }
      if (data.children && data.children.length) {
        data.children.forEach(child => removeNodeAndChildren(child))
      }
    }
    removeNodeAndChildren(node.data)
  }
}
// 双击事件处理
async function onDoubleClick(node: any) {
  if(node.data.isLeaf) {
    console.log("这是文件")
  }
  else {
    await Util.setAndJump(node.data.connected_workspace, node.data.id, router)
  }
}


// 计算函数
function updateTableHeight() {
  tableHeight.value = window.innerHeight - 152
}
// 时间戳转换为可读的形式
// const timeFormatter: VxeColumnPropTypes.Formatter = ({ cellValue }) => {
//   return typeof cellValue === 'number' ? Util.formatter.timeFormatter(cellValue) : '';
// }
// 读取特定工作空间下面的文件夹中的文件数据
const loadTable = async (workspace: number, associatedFolder:number | null = null) => {
  tableData.value = await window.electronAPI.dataOperation.loadTable(workspace,associatedFolder)
}
// 表格初始化
const initTable = async (workspace: number) => {
  // 进入之前浏览的文件夹中，切换页面保留
  await router.push({path: '/space', query: {w: store.currentWorkspace, f: store.currentFolder}})
  // 读取存在的文件类型
  const types= await window.electronAPI.dataOperation.queryAll('SELECT DISTINCT type FROM file WHERE connected_workspace = ? LIMIT 5',[workspace])
  tabs.value.push(...types)
  tableData.value = await window.electronAPI.dataOperation.loadTable(workspace)
}
// 对列的双击事件
// const handleDoubleClick: VxeTableEvents.CellClick<VXETableNode> = ({ row }) => {
//   if(row.type === 'folder'){
//
//     Util.setAndJump(row.connected_workspace, row.id, router)
//     // tree跟随展开
//     store.addExpandedNode("p_"+row.id)
//   }else {
//     console.log('开发中')
//   }
// }
//
// function breadClick(index: number) {
//   const w = pathArray.value[index].workspace
//   const f = pathArray.value[index].id
//   Util.setAndJump(w, f, router)
// }
//
// function handleVisibleChange(visible: boolean) {
//   dropdownVisible.value = visible
// }
//
// async function handleDropdownClick(index: number) {
//   activeTab = tabs.value[index];
//   if (activeTab.type === '全部文件'){
//     tableData.value = await window.electronAPI.dataOperation.loadTable(store.getCurrentWorkSpace)
//   }else {
//     console.log('开发中')
//   }
// }

const handleClickOutside = (event: MouseEvent) => {
  if (tableRef.value) {
    const table = tableRef.value
    const tableEl = table.$el;
    if (tableEl && !tableEl.contains(event.target as Node)) {
      table.clearCurrentRow();
    }
  }
};

function open() {
  Component.openDialog({
    type: "add",
    props:{
      title: "创建实体"
    }
  })
}



// // 搜索防抖
// watch(filterText, async (val) => {
//   if (timer) clearTimeout(timer)
//   timer = setTimeout(async () => {
//     await onSearch(store.currentWorkspace, val);
//   }, 300)
// })
//
//
// watch([() => route.query.f, () => route.query.w], async () => {
//   if (route.path === '/space' && route.query.f === '-1') {
//     await load()
//   }
// })




watch([() => route.query.f, () => route.query.w], async () => {
  pathArray.value = await Util.idToPathList(store.currentFolder, store.currentWorkspace)
  if (route.path === '/space' && route.query.f === '-1') {
    tableData.value = await window.electronAPI.dataOperation.loadTable(store.currentWorkspace)
    await load()
  }
  else{ await loadTable(store.currentWorkspace, store.currentFolder)}
})


store.$subscribe(async(mutation, _state) => {
  const events = mutation.events
  pathArray.value = await Util.idToPathList(store.currentFolder, store.currentWorkspace)
  if ((Array.isArray(events) && events.some(e => e.key === 'changedState')) || (!Array.isArray(events) && events.key === 'changedState')) {
    tableData.value = await window.electronAPI.dataOperation.loadTable(store.currentWorkspace)
    await load()
    await Util.setAndJump(store.currentWorkspace, -1, router)
    store.setChangedState(-1)
  }
})






onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  updateTableHeight()
  window.addEventListener('resize', updateTableHeight)
  initTable(store.getCurrentWorkSpace)
  load()
});



onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTableHeight)
})

import { vResize } from "@/utils/directives/resizable";

</script>

<template>
  <ViewContainer>
    <div class="mainView">
      <div class="mainView-sidebar" v-resize="{ storageKey: 'my-panel-width' }">
        <div class="resource-sidebar-title">快捷节点</div>
        <div class="resource-sidebar-section">
          <div v-for="(item, index) in sections" :key="index" class="mainView-sidebar-section-item" @click="nodeClick(item)">
            <Icon :type="item.icon"  source="bar"/>
            <span>{{ item.label }}</span>
          </div>
        </div>
        <div class="resource-sidebar-title">工作空间</div>
        <div class="mainView-sidebar-tree">
          <el-tree
              v-loading="isLoading"
              element-loading-text="加载数据中"
              ref="treeRef"
              class="tree"
              :data="data"
              node-key="uniqueKey"
              :props="defaultProps"
              draggable
              :allow-drop="allowDrop"
              @node-contextmenu="contextmenu"
              @node-drag-end="end"
              @node-drop="drop"
              :default-expanded-keys="store.expandedNode"
              @node-expand="expand"
              @node-collapse="collapse"
              :expand-on-click-node="false"
              :highlight-current="false"
              :indent="16">
            <template #default="{ node, data }">
              <div class="mainView-sidebar-tree-node" @click="handleClick(node, onSingleClick, onDoubleClick)">
                <Icon :type="data.type" :is-leaf="data.isLeaf" source="tree"/>
                <span :title="data.label"  :class="{ 'highlight': data.marked }">
                  {{ data.label }}
              </span>
              </div>
            </template>
          </el-tree>
        </div>
      </div>

      <div class="mainView-container">
        <div class="mainView-container-bread">

          <el-breadcrumb :separator-icon="ArrowRight" class="resource-container-collection-bread-path">
            <el-breadcrumb-item
                v-for="(item, index) in pathArray"
                :key="item.id" @click="breadClick(index)"
                class="mainView-container-bread-path-item"
            >
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>



          <div class="resource-container-collection-bread-button animate_press" @click="open">新增</div>
        </div>
        <div class="resource-container-collection-table">
          <TableContainer :data="tableData"></TableContainer>
        </div>
      </div>
    </div>
  </ViewContainer>
</template>

<style scoped>
.mainView {
  display: flex;
  flex-direction: row;
  flex: 1;
  user-select: none;
  height: calc(100% - 32px);
}

/* ---------------mainView-sidebar-------------*/
.mainView-sidebar {
  display: flex;
  flex-direction: column;
  min-width: 180px;
  width: 180px;
  height: 100%;
  border-right: 1px solid #D2D2D7;
}
.resource-sidebar-title {
  margin: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #6E6E73;
}
.resource-sidebar-section {
  margin-left: 8px;
  margin-right: 8px;
  font-size: 14px;
}
.mainView-sidebar-section-item {
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
  padding: 6px 12px;
  border-radius: 6px;
  color: #4B4B4F;
  cursor: pointer;
  transition: background 0.2s;
}
.mainView-sidebar-section-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
.mainView-sidebar-tree{
  flex: 1;
  overflow: auto;
}
.mainView-sidebar-tree::-webkit-scrollbar {
  display: none;
}
.mainView-sidebar-tree-node {
  display: flex;
  gap: 4px;
  width: 100%;
  align-items: center;
}


.mainView-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  padding: 0 12px 12px;
  background: transparent;
}
.resource-container-collection-table {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  border-radius: 6px;
  background: transparent;
  overflow-x: auto;
}
.mainView-container-bread {
  min-height: 46px;
  min-width: 450px;
  width: 100%;
  display: flex;


  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  background: transparent;
  font-size: 14px;
}
.resource-container-collection-bread-path{
  text-decoration: 1px underline;

  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 3px;
  padding: 0 12px;

  display: flex;
  justify-content: center;
  align-items: center;
}
.resource-container-collection-bread-button{
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 3px;
  padding: 0 12px;

  display: flex;
  justify-content: center;
  align-items: center;
}







</style>
