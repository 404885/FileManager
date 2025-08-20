<script lang="ts" setup>

defineProps({
  icon: {
    type:String,
    required:true,
  },
  width: String,
  height: String,
})

</script>

<template>
  <div class="BottomBar-controls" @mouseenter="$emit('hover', $event)" @mouseleave="$emit('leave', $event)">
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