<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { openMenu } from "@/utils/component/Menu.ts";

// 接口定义
interface TreeNode {
  label: string
  children?: TreeNode[]
  path: string
}

// 原始目录结构类型（后端返回）

// 树节点过滤文本
const filterText = ref('')

// el-tree 实例引用
const treeRef = ref()

// el-tree props 配置
const defaultProps = {
  children: 'children',
  label: 'label',
  path:'path',
}

// 树形数据绑定变量
const data = ref<TreeNode[]>([])

// 监听 filterText，实现 el-tree 的过滤功能
watch(filterText, (val) => {
  treeRef.value?.filter(val)
})

// 自定义过滤函数
const filterNode = (value: string, data: TreeNode) => {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}

const isLoading = ref<boolean>(false);
async function loadTree() {
  try {
    isLoading.value = true
    data.value = await window.electronAPI.dataOperation.loadTree()
    isLoading.value=false
  } catch (err) {
    console.error('加载目录结构失败:', err)
  }
}

function onRightClick(e: MouseEvent) {
  e.preventDefault()
  openMenu({
    positionX: e.clientX,
    positionY: e.clientY,
  })
}

// 页面加载后调用
onMounted(() => {
  loadTree()
})

</script>

<template>
  <div class="window-detail-wrapper" v-resizable="{ min: 180, max: 600 }" @contextmenu="onRightClick">
    <div class="window-detail">
      <input
          class="file-tree-filter"
          v-model="filterText"
          placeholder="Filter keyword"
      />
      <el-tree
          v-loading="isLoading"
          element-loading-text="加载中"
          ref="treeRef"
          class="file-tree"
          :data="data"
          :props="defaultProps"
          draggable
          highlight-current
          :filter-node-method="filterNode"
      />
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
}



/* 重置 el-tree 节点内容的 margin 和 padding */
::v-deep(.el-tree-node__content) {
  margin: 0 !important;
  padding: 0 !important;
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
  transform: translateY(0.5px) scale(0.985); /* 轻微下移且稍微缩小 */
  box-shadow: rgba(0, 0, 0, 0.12) 0 0.5px 1px; /* 阴影轻且更贴近 */
  background-color: #cde1ff;
}

/* 重置展开箭头的 margin 和 padding */
::v-deep(.el-tree-node__expand-icon) {
  margin: 7px;
  padding: 0 !important;

}

/* 重置子节点容器的 padding 和 margin */
::v-deep(.el-tree-node__children) {
  margin-left: 12px;
  margin-top: 6px;
  padding: 0 !important;
}

::v-deep(.el-tree-node) {
  margin-bottom: 8px; /* 增加子节点之间的垂直间距，可以根据需求调节 */
}

::v-deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: var(--icon-active-color, #a3c1ff);
  box-shadow: rgba(0, 0, 0, 0.12) 0 2px 4px; /* 轻阴影 */
  border-radius: 6px; /* 保持圆角 */
}


</style>
