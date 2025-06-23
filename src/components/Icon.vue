<script setup lang="ts">

const props = defineProps<{
  type: string,
  isLeaf: boolean,
}>()


const fileIconMap: Record<string, string> = JSON.parse(localStorage.getItem('customFileIconMap') || '{}')

// 动态切换icon
function iconSwitch(type: string, isLeaf: boolean) {
  if (isLeaf){
    return '#' + (fileIconMap[type] || 'icon-file')
  }
  else{
    return '#icon-morenwenjianjia'
  }
}

</script>

<template>
  <svg class="icon" aria-hidden="true" v-show="!props.isLeaf">
    <use :xlink:href="iconSwitch(props.type, props.isLeaf)"></use>
  </svg>
  <svg class="icon" aria-hidden="true" v-show="props.isLeaf">
    <use :xlink:href="iconSwitch(props.type, props.isLeaf)"></use>
  </svg>
</template>

<style scoped>
.icon {
  width: 16px;
  height: 16px;
  vertical-align: -0.20em;
  align-items: center;
  fill: currentColor;
  overflow: hidden;
}
</style>