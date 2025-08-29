<script lang="ts" setup>
import {useDeskTopCondition} from "@/pinia/DeskTopCondition.ts";

const Menu = 'BackToDeskTop';
const deskTopStore = useDeskTopCondition()

const handlePointerDown = (e:PointerEvent)=>{
  const el = e.currentTarget as HTMLElement
  el.style.background = 'rgba(255, 255, 255, 0.4)'
  el.style.opacity = '0.8'
}
const handlePointerUp = (e:PointerEvent)=>{
  const el = e.currentTarget as HTMLElement
  el.style.background = 'rgba(255,255,255,0.66)'
  el.style.opacity = '1'
  deskTopStore.minimizeAllWindow()
  if (deskTopStore.getActivateMenu === Menu){
    deskTopStore.setActivateMenu()
  }else {
    deskTopStore.setActivateMenu(Menu)
  }
}
function iconHover(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.background = 'rgba(255,255,255,0.66)'
}
function iconLeave(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.background = ''
}
</script>

<template>
  <div class="BackToDeskTop-wrapper"
       @pointerdown.stop="handlePointerDown"
       @pointerup.stop="handlePointerUp"
       @mouseenter="iconHover"
       @mouseleave="iconLeave">
  </div>
</template>

<style scoped>
.BackToDeskTop-wrapper {
  height: 100%;
  width: 6px;
  border: 1px solid rgba(128, 128, 128, 0.38);
  transition: background 0.2s ease;
  margin-left: 6px;
  margin-right: 2px;
}
</style>