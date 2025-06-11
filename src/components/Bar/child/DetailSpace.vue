<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { openMenu } from "@/utils/Menu.ts";

// 接口定义
interface TreeNode {
  label: string
  children?: TreeNode[]
  path: string
}

// 原始目录结构类型（后端返回）
interface RawNode {
  name: string
  path: string
  children?: RawNode[]
}

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

// 将后端返回的原始结构转换为 el-tree 结构
function convertToElTree(node: RawNode): TreeNode {
  if (node.children && Array.isArray(node.children)) {
    return {
      label: node.name,
      children: node.children.map(convertToElTree),
      path:node.path
    }
  } else {
    return {
      label: node.name,
      path:node.path
    }
  }
}

const isLoading = ref<boolean>(false);
// 初始化加载树结构
async function loadTree() {
  try {
    isLoading.value = true
    const result = await window.electronAPI.openDirectoryDialog()
    if (!result.canceled && result.files) {
      const rawTree = result.files
      data.value = [convertToElTree(rawTree)]
    }
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

.file-tree {
  background: #f9fbfd;
  height: calc(100vh - 82px);
  overflow: auto; /* 出现滚动条 */
  scrollbar-width: none;
}
</style>
