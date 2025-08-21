<script lang="ts" setup>

const props = defineProps({
  icon: {
    type:String,
    required:true,
  },
  hoverColor:{
    type:String,
    default:'',
  },
  width: String,
  height: String,
})

const handlePointerDown = (e:PointerEvent)=>{
  const el = e.currentTarget as HTMLElement
  el.style.background = 'rgba(255, 255, 255, 0.4)'
  el.style.opacity = '0.8'
}
const handlePointerUp = (e:PointerEvent)=>{
  const el = e.currentTarget as HTMLElement
  el.style.background = 'rgba(255,255,255,0.66)'
  el.style.opacity = '1'
}
function iconHover(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.background = 'rgba(255,255,255,0.66)'
  el.style.fill = props.hoverColor
}
function iconLeave(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.background = ''
  el.style.fill = ''
}
</script>

<template>
  <div class="BottomBar-controls"
       @pointerdown="handlePointerDown"
       @pointerup="handlePointerUp"
       @mouseenter="iconHover"
       @mouseleave="iconLeave">
    <svg class="button" aria-hidden="true" :style="{width:width || '1em',height:height || '1em'}">
      <use :href="'#icon-'+icon"/>
    </svg>
  </div>
</template>

<style scoped>
.BottomBar-controls {
  display: flex;
  height: 36px;
  width: 36px;
  position: relative;

  transition: background 0.2s ease;
}
.button{
  margin: auto;
}
</style>