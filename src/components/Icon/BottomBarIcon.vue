<script lang="ts" setup>

const props = defineProps({
  icon: {
    type:String,
    required:true,
  },
  hoverColor:String,
})

const hover=(event: MouseEvent)=>{
  const el = event.currentTarget as HTMLElement
  el.style.background = 'rgba(255, 255, 255, 0.91)'
  el.style.fill = props.hoverColor || ''
}
const leave=(event: MouseEvent)=>{
  const el = event.currentTarget as HTMLElement
  el.style.background = ''
  el.style.fill = ''
}

</script>

<template>
  <div class="BottomBar-controls" @mouseenter="hover" @mouseleave="leave">
    <svg class="button" aria-hidden="true">
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
  width: 1em;
  height: 1em;
}
</style>