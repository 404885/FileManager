<script setup lang="ts">

import { Data } from '@/utils'
const emit = defineEmits(['select'])


function itemClick(item: any) {
  emit('select', item) // 把 item 传给父组件
}

</script>


<template>
  <div class="menu-context" ref="container">
    <div class="context-file">
      <div class="context-item" v-for="item of Data.headData" @click="itemClick(item)">{{item.label}}</div>
    </div>
  </div>
</template>

<style scoped>
.menu-context {

  width: 100%;
  padding: 10px;
  border-radius: 8px;

  font-size: 14px;
  user-select: none;
  z-index: 1000;
  transition: box-shadow 0.3s ease;
}

.context-item {
  padding: 6px 6px 6px 10px;
  margin: 3px 0;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  color: #000000;
  background: transparent;
  transition: background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
  user-select: none;
}

.context-item:hover {
  background-color: #ebebeb; /* 浅灰色背景 */
  color: #000000; /* 保持文字颜色不变，或换成 #333 更柔和 */
}


</style>