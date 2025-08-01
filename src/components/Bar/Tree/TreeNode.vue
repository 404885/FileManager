<template>
  <div
      class="tree-node"
      draggable="true"
      @dragstart="onDragStart"
      @dragover.prevent
      @drop="onDrop"
  >
    <div class="tree-node-label" @click="toggle">
      <span v-if="hasChildren">{{ expanded ? '📂' : '📁' }}</span>
      <span v-else>📄</span>
      <slot v-if="!renderContent" :node="node">{{ node.label }}</slot>
      <component v-else :is="renderContent" :node="node" />
    </div>
    <div v-show="expanded" class="tree-node-children">
      <TreeNode
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :render-content="renderContent"
          :dragging-node-id="draggingNodeId"
          @update:dragging-node-id="$emit('update:dragging-node-id', $event)"
          @node-drop="$emit('node-drop', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TreeNode from './TreeNode.vue'
import type { TreeNodeData } from './TreeBar.vue'

const props = defineProps<{
  node: TreeNodeData
  renderContent?: (node: TreeNodeData) => any
  draggingNodeId: string | number | null
}>()

const emit = defineEmits<{
  (e: 'update:dragging-node-id', val: string | number | null): void
  (e: 'node-drop', val: TreeNodeData): void
}>()

const expanded = ref(true)
const hasChildren = computed(() => !!props.node.children?.length)

const toggle = () => {
  if (hasChildren.value) expanded.value = !expanded.value
}

const onDragStart = () => {
  emit('update:dragging-node-id', props.node.id)
}

const onDrop = () => {
  emit('node-drop', props.node)
}
</script>

<style scoped>
.tree-node {
  margin-left: 16px;
}
.tree-node-label {
  cursor: pointer;
  user-select: none;
}
.tree-node-children {
  margin-left: 12px;
}
</style>
