<script setup lang="ts">
import {ref, watch, onMounted } from 'vue'

import Icon from "@/components/Container/Icon.vue";

import { ElTreeNode } from "@/utils/type.ts";
import { useTreeCondition } from "@/pinia/TreeCondition.ts";
import {Component, Data, Util} from "@/utils"
import router from "@/router";
import { useRoute } from "vue-router";



//pinia初始化
const store = useTreeCondition()
// input过滤文本
const filterText = ref('')
// 绑定el-tree实例
const treeRef = ref()
// 注解传入tree的data
const data = ref<ElTreeNode[]>([])
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
const route = useRoute();



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



// 搜索功能
async function onSearch(workspace:number,keyword:string){
  isLoading.value = true
  data.value = await window.electronAPI.dataOperation.loadTree(workspace,keyword)
  isLoading.value = false
}


// 页面弹窗
function contextmenu(e: MouseEvent, data: ElTreeNode) {
  e.preventDefault()
  // Component.openMenu({
  //   isLeaf: data.isLeaf,
  //   positionX: e.clientX,
  //   positionY: e.clientY,
  //   treeRef,
  //   data
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



// 搜索防抖
watch(filterText, async (val) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(async () => {
    await onSearch(store.currentWorkspace, val);
  }, 300)
})


watch([() => route.query.f, () => route.query.w], async () => {
  if (route.path === '/space' && route.query.f === '-1') {
    await load()
  }
})


store.$subscribe(async(mutation, _state) => {
  const events = mutation.events

  if ((Array.isArray(events) && events.some(e => e.key === 'changedState')) || (!Array.isArray(events) && events.key === 'changedState')) {
    await load()
    store.setChangedState(-1)
  }
})


// 挂载的时候默认调用load初始化
onMounted(()=>{
  load()
})

</script>

<template>
    <div class="mainView-detail" v-resizable="{ storageKey: 'my-panel-width' }">
      <input class="detail-filter" v-model="filterText" placeholder="Filter keyword"/>
      <div class="detail-describe">快捷节点</div>
      <div class="detail-section">
        <div v-for="(item, index) in sections" :key="index" class="section-item" @click="nodeClick(item)">
          <span>{{ item.label }}</span>
          <Icon :type="item.icon"  source="bar"/>
        </div>
      </div>
      <div class="detail-describe">工作空间</div>
      <div class="detail-tree">
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
            <div class="tree-node" @click="handleClick(node, onSingleClick, onDoubleClick)">
              <Icon :type="data.type" :is-leaf="data.isLeaf" source="tree"/>
              <span :title="data.label"  :class="{ 'highlight': data.marked }">
                  {{ data.label }}
              </span>
            </div>
          </template>
        </el-tree>
      </div>

    </div>
</template>

<style scoped>

.detail-filter {
  height: 30px;
  padding: 5px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06); /* 更柔和的内阴影 */
  transition: border-color 0.25s ease-in-out, box-shadow 0.25s ease-in-out; /* 平滑过渡时间略长 */
}

.detail-describe{
  font-size: 12px;
  color: grey;
  margin-bottom: 4px;
  margin-top: 4px;
  text-wrap: nowrap;
}

.detail-tree {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

.section-item {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 关键点：左右分布 */
  padding: 6px 10px;
  font-size: 13px;
  color: #333;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
}

.section-item:hover {
  background: #dbeafe;
  color: #1d4ed8;
  cursor: pointer;
}


.tree {
  overflow: auto;
  color: #444;
  max-width: 300px;
  user-select: none;
  scrollbar-width: none;
}

.tree-node {
  width: 100%;
}

.highlight {
  color: #bfbf7b;
}

</style>


