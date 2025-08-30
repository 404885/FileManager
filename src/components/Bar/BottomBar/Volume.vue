<script lang="ts" setup>
import {watch} from "vue";
import {useDeskTopCondition} from "@/pinia/DeskTopCondition.ts";
import VolumeMenu from "@/components/Bar/BottomBar/VolumeMenu.vue";
import {debounce} from "@/utils/util.ts";

const Menu = 'volume'
const deskTopStore = useDeskTopCondition()

const saveVolume = debounce((value: number) => {
  localStorage.setItem("volume", String(value))
}, 500) // 500ms 后才执行一次

watch(()=>deskTopStore.getVolume,(newValue,_oldValue)=>{
  saveVolume(Number(newValue))
},{immediate:true})

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
}
function iconLeave(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.background = ''
}
</script>

<template>
  <div class="Volume-wrapper"
       @pointerdown.stop="handlePointerDown"
       @pointerup.stop="handlePointerUp"
       @mouseenter="iconHover"
       @mouseleave="iconLeave">
    <svg class="icon" aria-hidden="true">
      <use :href="'#icon-'+deskTopStore.getVolumeIcon"/>
    </svg>
  </div>
  <VolumeMenu :type="Menu"/>
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