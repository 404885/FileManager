<template>
  <div class="tree">
    <TreeNode
        v-for="node in data"
        :key="node.id"
        :node="node"
        :render-content="renderContent"
        :dragging-node-id="draggingNodeId"
        @update:dragging-node-id="val => draggingNodeId = val"
        @node-drop="onNodeDrop"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TreeNode from './TreeNode.vue'

export interface TreeNodeData {
  id: string | number
  label: string
  children?: TreeNodeData[]
}

const props = defineProps<{
  data: TreeNodeData[]
  renderContent?: (node: TreeNodeData) => any
}>()

const draggingNodeId = ref<string | number | null>(null)

// 在 treeData 中查找 id 对应的节点
function findNodeById(tree: TreeNodeData[], id: string | number): TreeNodeData | null {
  for (const node of tree) {
    if (node.id === id) return node
    if (node.children) {
      const result = findNodeById(node.children, id)
      if (result) return result
    }
  }
  return null
}

// 删除指定节点
function removeNode(tree: TreeNodeData[], target: TreeNodeData): boolean {
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node === target) {
      tree.splice(i, 1)
      return true
    }
    if (node.children && removeNode(node.children, target)) return true
  }
  return false
}

// 拖拽完成，将 dragging 节点添加到目标节点的 children
function onNodeDrop(targetNode: TreeNodeData) {
  if (!draggingNodeId.value || draggingNodeId.value === targetNode.id) return

  const draggingNode = findNodeById(props.data, draggingNodeId.value)
  if (!draggingNode) return

  removeNode(props.data, draggingNode)

  targetNode.children ||= []
  targetNode.children.push(draggingNode)

  draggingNodeId.value = null
}
</script>

<style scoped>
.tree {
  padding: 10px;
}
</style>
