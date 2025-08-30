<script lang="ts" setup>
import {useDeskTopCondition} from "@/pinia/DeskTopCondition.ts";
import WindowsMenu from "@/components/Bar/BottomBar/WindowsMenu.vue";

const Menu = 'windows'
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
  if (deskTopStore.getActivateMenu === Menu){
    deskTopStore.setActivateMenu()
  }else {
    deskTopStore.setActivateMenu(Menu)
  }
}
function iconHover(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.background = 'rgba(255,255,255,0.66)'
  el.style.fill = '#007aff'
}
function iconLeave(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.background = ''
  el.style.fill = ''
}
</script>

<template>
  <div class="Volume-wrapper"
       @pointerdown.stop="handlePointerDown"
       @pointerup.stop="handlePointerUp"
       @mouseenter="iconHover"
       @mouseleave="iconLeave">
    <svg class="icon" aria-hidden="true">
      <use :href="'#icon-windows8'"/>
    </svg>
  </div>
  <WindowsMenu :type="Menu"/>
</template>

<style scoped>
.Volume-wrapper {
  display: flex;
  height: 36px;
  width: 36px;
  position: relative;

  transition: background 0.2s ease;
}
.icon{
  margin: auto;
  width: 1em;
  height: 1em;
}
</style>