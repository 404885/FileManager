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
  el.style.setProperty('--after-width', '100%')  // 鼠标移入时拉满
}
function iconLeave(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.background = ''
  el.style.fill = ''
  el.style.setProperty('--after-width', '80%')  // 鼠标移出时恢复
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

  --after-width:80%
}
.BottomBar-controls::after{
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%); /* 居中对齐 */
  width: var(--after-width);
  height: 2px;
  background: #4fa3ff;
  border-radius: 2px;
  transition: all 0.3s ease;
}
.BottomBar-controls:hover::after{
  width: var(--after-width);
}
.button{
  margin: auto;
}
</style>