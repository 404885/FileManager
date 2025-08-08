<script setup lang="ts">
import TitleBar from "@/components/Bar/TitleBar.vue";
import { Util } from "@/utils";
import ResourceFolder from "@/components/Application/ResourceFolder.vue";
import BottomBar from "@/components/Bar/BottomBar.vue"
import {computed, nextTick, onMounted, reactive, ref, watch} from "vue";
import DeskTopIcon from "@/components/Icon/DeskTopIcon.vue";
import WebBrowser from "@/components/Application/WebBrowser.vue";
import Chat from "@/components/Application/Chat.vue";
import {useDeskTopCondition} from "@/pinia/DeskTopCondition.ts";
import {DESKTOP_ICON_SIZE} from "@/utils/constant.ts";
import {useClickHandler} from "@/utils/util.ts";
import DeskTopContextMenu from "@/components/Menu/DeskTopContextMenu.vue";
import RecycleContextMenu from "@/components/Menu/RecycleContextMenu.vue";
import {Applications} from "@/utils/type.ts"

const deskTopStore =useDeskTopCondition()


const applications = reactive<Applications[]>([
  {
    id:crypto.randomUUID(),
    name:'资源管理器',
    icon:'file_explorer',
    dblclick(){
      Util.openComponent(ResourceFolder, this.id,{ title: '资源管理器',id:crypto.randomUUID(),icon:this.icon,})
    },
    contextMenu(e:MouseEvent){
      e.stopPropagation()
      Util.openComponent(RecycleContextMenu, this.id,{position: { x: e.clientX, y: e.clientY }})
    },
  },
  {
    id:crypto.randomUUID(),
    name:'回收站',
    icon:'recycle_bin',
    dblclick(){

    },
    contextMenu(e:MouseEvent){
      e.stopPropagation()
      Util.openComponent(RecycleContextMenu,this.id, {position: { x: e.clientX, y: e.clientY }})
    },
  },
  {
    id:crypto.randomUUID(),
    name:'浏览器',
    icon:'chrome',
    dblclick(){
      Util.openComponent(WebBrowser,this.id,{ title: '浏览器' ,url : 'https://www.bing.com',id:crypto.randomUUID(),icon:this.icon, },false)
    },
    contextMenu(e:MouseEvent){
      e.stopPropagation()
      Util.openComponent(RecycleContextMenu, this.id,{position: { x: e.clientX, y: e.clientY }})
    },
  },
  {
    id:crypto.randomUUID(),
    name:'通讯',
    icon:'messages',
    dblclick(){
      Util.openComponent(Chat,this.id,{title:'通讯',id:crypto.randomUUID(),icon:this.icon,})
    },
    contextMenu(e:MouseEvent){
      e.stopPropagation()
      Util.openComponent(RecycleContextMenu,this.id, {position: { x: e.clientX, y: e.clientY }})
    },
  },
])


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

const cols = computed(() => {
  return containerWidth.value
      ? Math.floor(containerWidth.value / DESKTOP_ICON_SIZE)
      : 1
})

const positions = computed(() => {
  const arr: { x: number; y: number }[] = []
  const c = cols.value || 1
  applications.forEach((_, idx) => {
    const row = Math.floor(idx / c)
    const col = idx % c
    arr.push({
      x: col * DESKTOP_ICON_SIZE,
      y: row * DESKTOP_ICON_SIZE,
    })
  })
  return arr
})

const { handleClick } = useClickHandler<Applications>(
    (app) => app.id,
    (app) => console.log('单击:', app.name),
    (app) => app.dblclick?.()
)

function onRightClick(e: MouseEvent) {
  e.stopPropagation()
  Util.openComponent(DeskTopContextMenu,'桌面右键菜单',{position: { x: e.clientX, y: e.clientY }})
}

onMounted(() => {
  nextTick(updateContainerWidth)
  window.addEventListener("resize", updateContainerWidth)
  if (backgroundVideo.value) {
    backgroundVideo.value.volume = deskTopStore.getVolume
  }
})
</script>

<template>
  <div class="window-title">
    <TitleBar/>
  </div>
  <div class="window-home">
    <div id="window-view" ref="desktop" class="window-view" @contextmenu="onRightClick">
      <div id="wallpaper" class="window-background">
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
          :icon-size="DESKTOP_ICON_SIZE"
          :x="positions[index].x"
          :y="positions[index].y"
          @click="handleClick(app)"
          @contextmenu="app.contextMenu"
      />
      <div class="window-bottom">
        <BottomBar :applications="applications" />
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
  background: url('./assets/background/bustup_020_013.png') center center / cover no-repeat;
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


</style>