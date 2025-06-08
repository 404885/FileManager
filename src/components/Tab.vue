<script setup lang="ts">
import type {Component} from "vue";

const { text, icon }=defineProps<{
  icon?:Component,
  text?:string
}>()
</script>

<template>
  <el-icon class="tab-icon"><component :is="icon"/></el-icon>
  <span class="tab-text">
    {{text}}
  </span>
</template>

<style scoped>
@container tab (max-width: 30px) {
  .tab-icon{
    display: none;
  }
  .tab-text {
    display: none;
  }
}
@container tab (min-width: 30px) and (max-width:60px) {
  .tab-text {
    display: none;
  }
}
.tab-icon{
  position: absolute;
  top: 7px;
  left: 6px;
}
.tab-text{
  margin: auto;
  padding: 0 20px 0 20px;
  user-select: none;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
}
</style>