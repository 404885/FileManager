<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, nextTick} from 'vue'
import {useDeskTopCondition} from "@/pinia/DeskTopCondition.ts";

const BottomBarMenu = ref<HTMLElement | null>(null)

const deskTopStore = useDeskTopCondition()

const props = defineProps<{
  type:string,
}>()

const date = defineModel('date',{required: true})
const time = defineModel('time',{required: true})

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
    if (document.querySelector('body')) {
      target.value = 'body'
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
    <transition name="el-zoom-in-bottom">
      <div v-if="deskTopStore.getActivateMenu === props.type" class="BottomBarMenu" ref="BottomBarMenu">
        <div class="ClockMenu-wrapper">
          <div class="ClockMenu">
            <span class="Time">{{time}}</span>
            <span class="Date">{{date}}</span>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.BottomBarMenu{
  z-index: 9999;
}
.ClockMenu-wrapper{
  position: absolute;
  width: 20vw;
  height: 60vh;
  display: flex;
  bottom: 36px;
  right: 0;
  z-index: 9999;
  user-select: none;
  flex-direction: column;
  background: rgba(230, 230, 230, 0.8);
  box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.05);
}
.ClockMenu{
  display: flex;
  flex-direction: column;
  padding: 10px;
  position: relative;
}
.Time{
  font-size: 2.5vw;
}
.Date{
  font-size: 1vw;
}
.TimePicker{
  position: absolute;
}
</style>
