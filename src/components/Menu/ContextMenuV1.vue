<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
const contextMenuV1 = ref<HTMLElement | null>(null)

const emit = defineEmits(['close'])

const props = defineProps<{
  x: number;
  y: number;
  data: Array<{ label: string; key: string, disabled: boolean }>;
  resolve: (item: any) => void;
  title: string;
}>()


function click(item: any) {
  props.resolve(item);  // 点击时将值传回外部
  emit('close', item);
}


function handleClickOutside(e: MouseEvent) {
  if (contextMenuV1.value && !contextMenuV1.value.contains(e.target as Node)) {
    emit('close', null)
  }
}

onMounted(() => {
  console.log('Menu mounted');
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

</script>

<template>
  <Teleport to="body">
    <div class="menu-context" ref="contextMenuV1"  :style="{ left: `${props.x}px`, top: `${props.y}px` }">
      <div class="context-file">
        <div class="context-title">{{props.title}}</div>
        <div class="context-item" v-for="item of props.data" @click="click(item)" :class="{ disabled: item.disabled }">
          {{item.label}}
        </div>
      </div>
    </div>
  </Teleport>
</template>



<style scoped>
.menu-context {
  position: absolute;
  background: white;
  width: 100px;
  z-index: 1000;
  border-radius: 6px;
  padding-left: 4px;
  padding-right: 4px;
  font-size: 14px;
  user-select: none;
  transition: box-shadow 0.3s ease;
}
.context-item {
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
.context-item:hover {
  background-color: #ebebeb; /* 浅灰色背景 */
  color: #000000; /* 保持文字颜色不变，或换成 #333 更柔和 */
}
.context-item.disabled {
  background-color: #f0f0f0;
  color: #aaa;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
  font-style: italic;
}
.context-title {
  padding: 6px 6px 6px 10px;
  margin: 4px 0;
  border-radius: 3px;
  font-size: 13px;
  color: #000000;
  background: transparent;
}
</style>