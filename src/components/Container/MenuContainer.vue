<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, CSSProperties } from 'vue'

const emit = defineEmits(['close'])

const props = defineProps<{
  position: {x: number; y: number};
  data: Array<{ name: string, icon: string, click: (item: any) => void }>,
  customStyle?: CSSProperties;
  customClass?: string
  resolve: (item: any) => void;
}>()


const menu = ref<HTMLElement | null>(null)

// 点击外部区域关闭
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
  <div ref="menu"
      class="context-menu"
      :style="[{ top: `${props.position.y}px`, left: `${props.position.x}px` }, props.customStyle]"
      :class="props.customClass">
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
