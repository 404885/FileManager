<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, CSSProperties } from 'vue'

const emit = defineEmits(['close', 'click'])

const props = defineProps<{
  position: {x: number; y: number};
  data: Array<{ name: string, icon: string, click: (item: any) => void }>,
  customStyle?: CSSProperties;
  customClass?: string
  resolve?: (item: any) => void;
}>()


const menu = ref<HTMLElement | null>(null)

// 点击外部区域关闭
function handleClickOutside(e: MouseEvent) {
  if (menu.value && !menu.value.contains(e.target as Node)) {
    emit('close')
  }
}

function handleClick(item: any) {
  item.click()
  emit('close', item)
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})


</script>

<template>
  <Teleport to="body">
  <div
      ref="menu"
      class="context-menu"
      :style="[{ top: `${props.position.y}px`, left: `${props.position.x}px` }, props.customStyle]"
      :class="props.customClass">
    <div class="context-item" v-for="item of props.data" @click="handleClick(item)">
      <svg aria-hidden="true" class="context-item-icon" :style="{width: '1.5em',height: '1.5em'}">
        <use :href="'#icon-'+item.icon"/>
      </svg>
      <span class="context-item-name">{{item.name}}</span>
    </div>
    <slot />
  </div>
  </Teleport>
</template>

<style scoped>
.context-menu {
  position: absolute;
  background: white;
  z-index: 1000;
  border-radius: 6px;
  padding: 4px 4px;
  font-size: 14px;
  user-select: none;
  transition: box-shadow 0.3s ease;
}
.context-item {
  display: flex;
  padding: 6px 6px 6px 2px;
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
.context-item-icon{
  margin-right: 5px;
}
.context-item-name{
  margin-right: auto;
}
</style>
