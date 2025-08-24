<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import ClockMenu from "@/components/Bar/BottomBar/ClockMenu.vue";
import {useDeskTopCondition} from "@/pinia/DeskTopCondition.ts";

const Menu = 'clock'
const deskTopStore = useDeskTopCondition()

const currentTime = ()=>{
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1)
  const d = String(now.getDate())
  const h = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  return [`${y}/${m}/${d}`,`${h}:${min}:${s}`]
}

const date =ref<string>()
const time =ref<string>()
function update() {
  const [d, t] = currentTime()
  date.value = d
  time.value = t
}

const handlePointerDown = (e:PointerEvent)=>{
  const el = e.currentTarget as HTMLElement
  el.style.background = 'rgba(255, 255, 255, 0.4)'
}
const handlePointerUp = (e:PointerEvent)=>{
  const el = e.currentTarget as HTMLElement
  el.style.background = 'rgba(255,255,255,0.66)'
  if (deskTopStore.getActivateMenu === Menu){
    deskTopStore.setActivateMenu()
  }else {
    deskTopStore.setActivateMenu(Menu)
  }
}
function hover(e: MouseEvent,hoverColor: string = '') {
  const el = e.currentTarget as HTMLElement
  el.style.background = 'rgba(255,255,255,0.66)'
  el.style.fill = hoverColor
}
function leave(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.background = ''
  el.style.fill = ''
}

let clockTimer: number | null = null
onMounted(()=>{
  update()
  clockTimer = window.setInterval(update, 1000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})
</script>

<template>
  <div class="time-wrapper"
       @mouseenter="hover"
       @mouseleave="leave"
       @pointerdown.stop="handlePointerDown"
       @pointerup.stop="handlePointerUp">
    <div class="time">
      <span class="hour">
        {{time}}
      </span>
      <span class="date">
        {{date}}
      </span>
    </div>
  </div>
  <ClockMenu :type="Menu"/>
</template>

<style scoped>
.time-wrapper{
  font-size: 12px;
  height: 36px;
  position: relative;
  user-select: none;
}
.time{
  display: flex;
  flex-direction: column;
  padding: 3px 10px 0 10px;
}
.hour{
  margin: 0 auto;
}
.time-wrapper:hover{
  background: rgba(255, 255, 255, 0.66);
  user-select: none;
}
</style>