<script setup lang="ts">
import TitleBar from "@/components/Bar/TitleBar.vue";
import { Util } from "@/utils";
import ResourceFolder from "@/components/Application/ResourceFolder.vue";
import { ref,watch } from "vue";

import {useTreeCondition} from "@/pinia/TreeCondition.ts";


const testf = ref<number>(1)
const testw = ref<number>(1)


const store =useTreeCondition()

function aaa(){
  // store.setCurrentWorkspace(1);store.setCurrentFolder(-1)
  Util.openComponent(ResourceFolder, { title: '资源管理器' })
}


watch(testf, (newVal) => {
  store.setCurrentFolder(newVal)
})

watch(testw, (newVal) => {
  store.setCurrentWorkspace(newVal)
})


</script>

<template>
  <div class="window-title">
    <TitleBar/>
  </div>
  <div class="window-home">
    <div class="window-view">
      <div class="menu-icon" @dblclick="aaa">dsadas</div>
      <input type="text" v-model.number="testf">
      <input type="text" v-model.number="testw">



    </div>
  </div>
</template>

<style scoped>
.window-home {


  display: flex;
  background: white;
  height: 100%;
  background: linear-gradient(to bottom right, #a1c4fd, #c2e9fb);
  overflow: hidden;

  border-radius: 6px;
  margin: 0 8px 8px;
  box-shadow:
      inset 0 0 1px rgba(255, 255, 255, 0.4), /* 非常轻微的高光 */
      0 4px 12px rgba(0, 0, 0, 0.06);           /* 原本阴影保持 */


}

.window-title {
  height: 32px;
  background: #f5f5f5;;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 12px;
  box-sizing: border-box;
  z-index: 9999;
  -webkit-app-region: drag;
}

.window-view {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('https://picsum.photos/1200/800') center center / cover no-repeat;

  display: flex;
  flex-direction: row; /* 如果你想竖排，就改为 column */
}


.menu-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}


</style>