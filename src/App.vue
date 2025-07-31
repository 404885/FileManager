<script setup lang="ts">
import TitleBar from "@/components/Bar/TitleBar.vue";
import { Util } from "@/utils";
import ResourceFolder from "@/components/Application/ResourceFolder.vue";
import {ref, watch} from "vue";
import BottomBar from "@/components/Bar/BottomBar.vue";
import {useTreeCondition} from "@/pinia/TreeCondition.ts";
import DeskTopIcon from "@/components/Icon/DeskTopIcon.vue";
import WebBrowser from "@/components/Application/WebBrowser.vue";

const testf = ref<number>(1)
const testw = ref<number>(1)


const store =useTreeCondition()

function aaa(){
  // store.setCurrentWorkspace(1);store.setCurrentFolder(-1)
  Util.openComponent(ResourceFolder, { title: '资源管理器' })
}

function openBrowser(){
  Util.openComponent(WebBrowser,{ title: '浏览器' ,url : 'https://www.bing.com' },false)
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
    <div id="window-view" class="window-view">
      <DeskTopIcon :name="'资源管理器'" :icon="'file_explorer'" @dblclick="aaa"/>
      <DeskTopIcon :name="'浏览器'" :icon="'chrome'" @dblclick='openBrowser'/>
<!--      <input type="text" v-model.number="testf">-->
<!--      <input type="text" v-model.number="testw">-->
      <div class="window-bottom">
        <BottomBar/>
      </div>
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
  background: url('./assets/background/bustup_020_004.png') center center / cover no-repeat;
  background-size: contain;

  display: flex;
  flex-direction: row; /* 如果你想竖排，就改为 column */
}

.window-bottom{
  position: absolute;
  bottom: 0;
  flex: 1;
  width: 100%;
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