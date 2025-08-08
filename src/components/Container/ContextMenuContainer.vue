<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, CSSProperties } from 'vue'

const emit = defineEmits(['close'])
defineProps<{
  position: { x: number, y: number }
  customStyle?: CSSProperties
}>()

const menu = ref<HTMLElement | null>(null)

function handleClickOutside(e: MouseEvent) {
  if (menu.value && !menu.value.contains(e.target as Node)) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
      ref="menu"
      class="context-menu"
      :style="[{ top: `${position.y}px`, left: `${position.x}px` }, customStyle]"
  >
    <slot />
  </div>
</template>

<style scoped>
.context-menu {
  position: absolute;
  background-color: #eeeeee;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  min-width: 140px;
  height: fit-content;
  z-index: 9999;
}
</style>
