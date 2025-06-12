<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

const emit = defineEmits(['close'])
const container = ref<HTMLElement | null>(null)
const props = defineProps({
  positionX: { type: Number },
  positionY: { type: Number },
})


// 最终计算出的显示位置
const computedX = ref(props.positionX)
const computedY = ref(props.positionY)

function adjustPosition() {
  if (!container.value) return

  const menuW = container.value.offsetWidth
  const menuH = container.value.offsetHeight
  const winW = window.innerWidth
  const winH = window.innerHeight
  const pad = 8

  let x = props.positionX ?? 0  // 使用默认值 0
  let y = props.positionY ?? 0  // 使用默认值 0

  if (x + menuW > winW - pad) {
    x = winW - menuW - pad
  }
  if (y + menuH > winH - pad) {
    y = winH - menuH - pad
  }

  computedX.value = Math.max(pad, x)
  computedY.value = Math.max(pad, y)
}

function handleClick(e: MouseEvent) {
  if (container.value && !container.value.contains(e.target as Node)) {
    emit('close')
  }
}

onMounted(async () => {
  await nextTick()
  adjustPosition()
  document.addEventListener('click', handleClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClick)
})

// 监听位置变化后重新调整
watch(() => [props.positionX, props.positionY], async () => {
  await nextTick()
  adjustPosition()
})
</script>



<template>
    <div
        class="menu-context"
        :style="{ top: `${computedY}px`, left: `${computedX}px` }"
        ref="container">
      这是上下文菜单
    </div>
</template>

<style scoped>
.menu-context {
  position: absolute;
  width: 200px;
  height: 150px;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);  /* 半透明白 */
  backdrop-filter: blur(12px);            /* 背景模糊 */
  -webkit-backdrop-filter: blur(12px);    /* 兼容 Safari */
  border: 1px solid rgba(255, 255, 255, 0.4); /* 半透明边框 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: #222;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  user-select: none;
  z-index: 1000;
  transition: box-shadow 0.3s ease;
}

.menu-context:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}
</style>