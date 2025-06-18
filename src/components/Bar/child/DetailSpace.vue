<script setup lang="ts">
import {ref, watch, onMounted } from 'vue'
import { openMenu } from "@/utils/component/Menu.ts";
import Icon from "@/components/Icon.vue";
import path from "node:path";

// 定义tree数据传入
interface TreeNode {
  label: string
  children?: TreeNode[]
  path: string
}

interface ElTreeNode {
  id: number;
  label: string;
  children?: ElTreeNode[];
  isLeaf?: boolean;
  fullPath?: string;
  size?: number;
}

// input过滤文本
const filterText = ref('')
// 绑定el-tree实例
const treeRef = ref()
// 注解传入tree的data
const data = ref<ElTreeNode[]>([])
// 默认加载动画为false
const isLoading = ref<boolean>(false);


// el-tree props 配置
const defaultProps = {
  children: 'children',
  label: 'label',
  path: 'path',
}

// 监听过滤值变化，并调用回调函数向过滤方法中传值
watch(filterText, (val) => {
  treeRef.value?.filter(val)
})

// 自定义过滤函数（回调函数传入值，el-tree的全部树节点）
const filterNode = (value: string, data: TreeNode) => {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}


// 初始化加载树结构
async function load() {
  try {
    data.value = await window.electronAPI.dataOperation.loadTree()
  } catch (err) {
    console.error('加载目录结构失败:', err)
  }
}


const allowDrop = (draggingNode: { data: ElTreeNode }, dropNode: { data: ElTreeNode }, dropType: 'prev' | 'inner' | 'next') => {
  console.log("drag:", draggingNode.data)
  console.log("drop:", dropNode.data)
  if(draggingNode.data.id == dropNode.data.id) {
    return false
  }
  return dropType === 'inner'
}


// 页面弹窗
function onRightClick(e: MouseEvent, data: ElTreeNode) {
  e.preventDefault()
  openMenu({
    positionX: e.clientX,
    positionY: e.clientY,
  })
  console.log(data)
  treeRef.value?.setCurrentKey(data.id)
}





// 页面加载后调用
onMounted(() => {
  load()
})

</script>

<template>
  <div class="window-detail-wrapper" v-resizable="{ min: 180, max: 600 }">
    <div class="window-detail">
      <input class="file-tree-filter" v-model="filterText" placeholder="Filter keyword"/>
      <div class="default">默认收藏</div>

      <el-tree
          v-loading="isLoading"
          element-loading-text="加载数据中"
          ref="treeRef"
          class="file-tree"
          :data="data"
          node-key="id"
          :props="defaultProps"
          draggable
          :filter-node-method="filterNode"
          :allow-drop="allowDrop"
          @node-contextmenu="onRightClick"
          :indent="16"
      >
        <template #default="{ node, data }">
          <div class="test">
            <Icon :label="data.label" :is-leaf="data.isLeaf" :level="String(node.level)"/>
            <span>
               {{ data.label }}
            </span>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<style scoped>
.window-detail-wrapper {
  display: flex;
  background: var(--menu-bg);
  border-right: 1px solid var(--menu-border);
  flex-direction: column;
}

.window-detail {
  flex: 1;
  padding: 5px;
  user-select: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.file-tree-filter {
  height: 30px;
  padding: 5px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* 树背景和字体 */
.file-tree {
  background: #f9fbfd;
  font-size: 14px;
  color: #444;
  width: auto;
  height: calc(100vh - 82px);
  overflow: auto; /* 出现滚动条 */
  scrollbar-width: none;
  --el-tree-node-hover-bg-color: #e6f0ff; /* 轻微悬浮底色 */
  user-select: none;
}



/* 关闭拖拽线 */
::v-deep(.el-tree__drop-indicator) {
  display: none !important;
}


/* 相当于节点 */
::v-deep(.el-tree-node__content) {
  margin-top: 8px;
  cursor: pointer;
  border-radius: 6px; /* 圆角 */
  transition:
      background-color 0.2s,
      transform 0.2s,
      box-shadow 0.2s;
}
::v-deep(.el-tree-node__content:hover) {
  box-shadow: rgba(0, 0, 0, 0.15) 0 2px 4px; /* 阴影更轻 */
  background-color: #e6f0ff;
}
::v-deep(.el-tree-node__content:active) {
  transform: translateY(1px) scale(0.985); /* 轻微下移且稍微缩小 */
  box-shadow: rgba(0, 0, 0, 0.12) 0 1px 1px; /* 阴影轻且更贴近 */
  background-color: #cde1ff;
}

/* el-tree-node是节点即选中节点，但选中节点可能包含孙元素，因此用大于符号选中直接子元素 */
::v-deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #a3c1ff;
  box-shadow: rgba(0, 0, 0, 0.12) 0 2px 4px; /* 轻阴影 */
  border-radius: 6px; /* 保持圆角 */
}

/* el-tree-node是节点即选中节点，但选中节点可能包含孙元素，因此用大于符号选中直接子元素 */
::v-deep(.el-tree-node.is-drop-inner > .el-tree-node__content) {
  background-color: transparent;           /* 取消背景色 */
  border: 2px dashed #409eff;               /* 蓝色虚线边框 */
  box-shadow: none;                         /* 去掉阴影 */
  border-radius: 6px;                       /* 保持圆角 */
  transition: border-color 0.3s ease;      /* 动画效果 */
}
</style>


