<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  positionX: { type: Number },
  positionY: { type: Number },
})

const emit = defineEmits(['close'])

const container = ref<HTMLElement | null>(null)

function handleClick(e: MouseEvent) {
  if (container.value && container.value.contains(e.target as Node)) {
    console.log('点击发生在基组件内部')
  } else {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('click', handleClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClick)
})

</script>



<template>
    <div
        class="menu-context"
        :style="{ top: `${props.positionY}px`, left: `${props.positionX}px` }"
        ref="container">
      这是上下文菜单
    </div>
</template>

<style scoped>
.menu-context {
  position: absolute;
  background: #b39ddb;
}
</style>