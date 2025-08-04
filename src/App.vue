<script setup lang="ts">
import TitleBar from "@/components/Bar/TitleBar.vue";
import { Util } from "@/utils";
import ResourceFolder from "@/components/Application/ResourceFolder.vue";
import BottomBar from "@/components/Bar/BottomBar.vue"
import {computed, nextTick, onMounted, reactive, ref, watch} from "vue";
import {useTreeCondition} from "@/pinia/TreeCondition.ts";
import DeskTopIcon from "@/components/Icon/DeskTopIcon.vue";
import WebBrowser from "@/components/Application/WebBrowser.vue";
import Chat from "@/components/Application/Chat.vue";
import {useDeskTopCondition} from "@/pinia/DeskTopCondition.ts";

const ICON_SIZE   = 80  // 桌面图标宽高

const testf = ref<number>(1)
const testw = ref<number>(1)

interface Applications{
  id:string,
  name:string,
  icon:string,
  dblclick?:Function,
}


const treeStore =useTreeCondition()
const deskTopStore =useDeskTopCondition()


const applications = reactive<Applications[]>([
  {
    id:crypto.randomUUID(),
    name:'资源管理器',
    icon:'file_explorer',
    dblclick:()=>{
      Util.openComponent(ResourceFolder, { title: '资源管理器' })
    }
  },
  {
    id:crypto.randomUUID(),
    name:'回收站',
    icon:'recycle_bin',
    dblclick:()=>{

    }
  },
  {
    id:crypto.randomUUID(),
    name:'浏览器',
    icon:'chrome',
    dblclick:()=>{
      Util.openComponent(WebBrowser,{ title: '浏览器' ,url : 'https://www.bing.com' },false)
    }
  },
  {
    id:crypto.randomUUID(),
    name:'通讯',
    icon:'messages',
    dblclick:()=>{
      Util.openComponent(Chat,{title:'通讯'})
    }
  },
])

watch(testf, (newVal) => {
  treeStore.setCurrentFolder(newVal)
})

watch(testw, (newVal) => {
  treeStore.setCurrentWorkspace(newVal)
})

watch(()=>deskTopStore.getVolume, (newVal) => {
  if (backgroundVideo.value) {
    backgroundVideo.value.volume = newVal
  }
})

// 容器引用 & 宽度
const desktop = ref<HTMLElement | null>(null)
const containerWidth = ref(0)

// 测量容器宽度
function updateContainerWidth() {
  if (desktop.value) {
    containerWidth.value = desktop.value.clientWidth
  }
}

const backgroundVideo = ref<HTMLVideoElement | null>(null)

onMounted(() => {
  nextTick(updateContainerWidth)
  window.addEventListener("resize", updateContainerWidth)

  if (backgroundVideo.value) {
    backgroundVideo.value.volume = deskTopStore.getVolume
  }
})

const cols = computed(() => {
  return containerWidth.value
      ? Math.floor(containerWidth.value / ICON_SIZE)
      : 1
})

const positions = computed(() => {
  const arr: { x: number; y: number }[] = []
  const c = cols.value || 1
  applications.forEach((_, idx) => {
    const row = Math.floor(idx / c)
    const col = idx % c
    arr.push({
      x: col * ICON_SIZE,
      y: row * ICON_SIZE,
    })
  })
  return arr
})
</script>

<template>
  <div class="window-title">
    <TitleBar/>
  </div>
  <div class="window-home">
    <div id="window-view" ref="desktop" class="window-view">
      <div class="window-background">
        <video ref="backgroundVideo"
               autoplay
               loop
               src="./assets/video/senrenbanka.mp4"
               :muted="false"/>
      </div>
      <DeskTopIcon
          v-for="(app, index) in applications"
          :key="app.id"
          :id="app.id"
          :icon="app.icon"
          :name="app.name"
          :icon-size="ICON_SIZE"
          :x="positions[index].x"
          :y="positions[index].y"
          @dblclick="app.dblclick"
      />
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

  display: flex;
  flex-direction: column; /* 如果你想竖排，就改为 column */
}

.window-background{
  position: relative;
  width: 100%;
  height: 100%;
  background: url('./assets/background/bustup_020_004.png') center center / cover no-repeat;
  background-size: contain;

  z-index: -1;
  display: flex;
  flex-direction: column; /* 如果你想竖排，就改为 column */
}
.window-background video{
  width: 100%;
  height: 100%;
  object-fit: cover;
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