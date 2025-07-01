<script setup lang="ts">

const props = defineProps<{
  type?: string,
  isLeaf?: boolean,
  source: string,
}>()


// const IconSource =

const fileIconMap: Record<string, string> = JSON.parse(localStorage.getItem('customFileIconMap') || '{}')

// 动态切换icon
function iconSwitch(type: string, isLeaf: boolean, source: string) {
  if (source === 'tree') {
    if (isLeaf){
      return  fileIconMap[type] || fileIconMap.default
    }
    else{
      return '#icon-morenwenjianjia'
    }
  }
  else if (source === 'bar') {
    return type
  }

}

</script>

<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="iconSwitch(props.type, props.isLeaf, props.source)"></use>
  </svg>
</template>

<style scoped>
.icon {
  width: 16px;
  height: 16px;
  vertical-align: -0.20em;
  align-items: center;
  overflow: hidden;
}
</style>