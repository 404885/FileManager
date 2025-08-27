<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, nextTick} from 'vue'
import {useDeskTopCondition} from "@/pinia/DeskTopCondition.ts";

const BottomBarMenu = ref<HTMLElement | null>(null)

const deskTopStore = useDeskTopCondition()

const props = defineProps<{
  type:string,
}>()

function handleClickOutside(e: MouseEvent) {
  // 更健壮：如果没有元素直接 return
  const el = BottomBarMenu.value
  if (!el) return
  if (!el.contains(e.target as Node)) {
    deskTopStore.setActivateMenu()
  }
}
const target = ref<string | null>(null)
onMounted(() => {
  // 用 pointerdown 也可以更早拦截，按需替换
  nextTick(() => {
    if (document.querySelector('#window-view')) {
      target.value = '#window-view'
    }
  })
  document.addEventListener('pointerup', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerup', handleClickOutside)
})
</script>

<template>
  <Teleport v-if="target" :to="target">
    <transition name="slide-right">
      <div v-if="deskTopStore.getActivateMenu === props.type" class="BottomBarMenu" ref="BottomBarMenu">
        <div class="NotificationMenu-wrapper">

        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.BottomBarMenu{
  z-index: 9999;
}
.NotificationMenu-wrapper{
  position: absolute;
  width: 25vw;
  height: 100vh;
  display: flex;
  bottom: 36px;
  right: 0;
  z-index: 9999;
  flex-direction: column;
  background: rgba(230, 230, 230, 0.8);
  box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.05);
}
/* 进入和离开动画 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* 初始状态：从右边移进来 */
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 结束状态：在原位 */
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
