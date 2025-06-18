<script setup lang="ts">

const props = defineProps({
  label: {
    type: String,
    default: null  // 默认空字符串
  },
  level: {
    type: String,
    default: ''  // 默认空字符串，或者你想要的默认值
  },
  isLeaf: {
    type: Boolean,
    default: false
  }
})

const fileIconMap: Record<string, string> = JSON.parse(localStorage.getItem('customFileIconMap') || '{}')

// 动态切换icon
function iconSwitch(label: string, isLeaf: boolean) {
  const splitList = label.split('.')
  if (isLeaf){
    if (splitList.length > 1) {
      const suffix = splitList.pop() as string
      return '#' + (fileIconMap[suffix] || 'icon-file')
    }
    else {
      return '#icon-morenwenjianjia'
    }
  }
  else{
    return '#icon-morenwenjianjia'
  }
}

</script>

<template>
  <svg class="icon" aria-hidden="true" v-show="!props.isLeaf">
    <use :xlink:href="iconSwitch(props.label, props.isLeaf)"></use>
  </svg>
  <svg class="icon" aria-hidden="true" v-show="props.isLeaf">
    <use :xlink:href="iconSwitch(props.label, props.isLeaf)"></use>
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