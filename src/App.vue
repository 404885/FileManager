<script setup lang="ts">
import Docker from "@/view/DeskTop/Docker/Docker.vue";

import { Util,Data } from "@/utils";
import BottomBar from "@/components/Bar/BottomBar.vue"
import {computed, nextTick, onMounted, ref, watch} from "vue";
import DeskTopIcon from "@/components/Icon/DeskTopIcon.vue";
import { useDeskTopCondition } from "@/pinia/DeskTopCondition.ts";
import {DESKTOP_ICON_SIZE} from "@/utils/constant.ts";
import {useClickHandler} from "@/utils/util.ts";
import {Applications} from "@/utils/type.ts"
import MenuContainerV1 from "@/components/Container/MenuContainerV1.vue";
import WallPaper from "@/components/Application/WallPaper.vue";
import TopBarV1 from "@/view/DeskTop/Title/TopBarV1.vue";
import TitleBar from "@/components/Bar/TitleBar.vue";


const applications = Data.applicationData
// 容器引用 & 宽度
const desktop = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const backgroundVideo = ref<HTMLVideoElement | null>(null)
const deskTopStore =useDeskTopCondition()


async function onDeskTopRightClick(e: MouseEvent) {
  e.stopPropagation()
  const result = await Util.asyncOpenComponent(MenuContainerV1,'桌面右键菜单', {
    position: { x: e.clientX, y: e.clientY },
    data:  [
      { name: "全部窗口最小化",
        click: () => {
          deskTopStore.minimizeAllWindow()
        }
      },
      { name: "壁纸", icon: "wallpaper_roll",
        click: () => {Util.openComponent(WallPaper,'wallpaper',{id:'wallpaper',icon: "wallpaper_roll",title:'壁纸'})}
      },
      { name: "新建笔记", icon: "md",
        click: () => {

        }
      },
    ],
  })
  if (result){
    console.log(result)
  }
}

async function onBottomBarRightClick(e: MouseEvent) {
  e.stopPropagation()
  const iconEl = (e.target as HTMLElement).closest('[data-id]')
  const appId = iconEl?.getAttribute('data-id')
  const result = await Util.asyncOpenComponent(MenuContainerV1,'底边栏右键菜单', {
    position: { x: e.clientX, y: e.clientY - 30 },
    data:  [
      {
        name: "关闭",
        icon: "delete",
        click: () => {
          if (appId){
            deskTopStore.removeApplication(appId)
          }
        }
      },
    ],
  })
  if (result){
    console.log(result)
  }
}

const { handleClick } = useClickHandler<Applications>(
    (app) => app.id,
    (app) => console.log('单击:', app.name),
    (app) => app.dblclick?.()
)

// 测量容器宽度
const updateContainerWidth = () => {
  if (desktop.value) {
    containerWidth.value = desktop.value.clientWidth
  }
}

const cols = computed(() => {
  return containerWidth.value ? Math.floor(containerWidth.value / DESKTOP_ICON_SIZE) : 1
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

watch(()=>deskTopStore.getVolume, (newVal) => {
  if (backgroundVideo.value) {
    backgroundVideo.value.volume = newVal
  }
})

const isSelecting = ref(false);
const selectionBox = ref({ x: 0, y: 0, w: 0, h: 0 });
const startPoint = ref({ x: 0, y: 0 });

function onPointerDown(e: PointerEvent) {
  const rect = desktop.value!.getBoundingClientRect()
  startPoint.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
  selectionBox.value = {
    x: startPoint.value.x,
    y: startPoint.value.y,
    w: 0,
    h: 0
  }
  isSelecting.value = true

  window.addEventListener("pointermove", onPointerMove)
  window.addEventListener("pointerup", onPointerUp)
}

function onPointerMove(e: PointerEvent) {
  if (!isSelecting.value) return
  const rect = desktop.value!.getBoundingClientRect()
  const currentX = e.clientX - rect.left
  const currentY = e.clientY - rect.top

  const x = Math.min(startPoint.value.x, currentX)
  const y = Math.min(startPoint.value.y, currentY)
  const w = Math.abs(currentX - startPoint.value.x)
  const h = Math.abs(currentY - startPoint.value.y)

  selectionBox.value = { x, y, w, h }
}



function onPointerUp() {
  isSelecting.value = false;
  // 移除全局事件
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
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

  <div class="window">
    <TopBarV1></TopBarV1>

    <div id="window-view" ref="desktop" class="window-view"  @contextmenu="onDeskTopRightClick">
      <div class="window-background" @pointerdown="onPointerDown">
<!--        <video ref="backgroundVideo"-->
<!--               autoplay-->
<!--               loop-->
<!--               src="./assets/video/senrenbanka.mp4"-->
<!--               :muted="false"/>-->
      </div>
      <DeskTopIcon v-for="(app, index) in applications"
          :key="app.id"
          :id="app.id"
          :icon="app.icon"
          :name="app.name"
          :icon-size="DESKTOP_ICON_SIZE"
          :x="positions[index].x"
          :y="positions[index].y"
          @click="handleClick(app)"
          @contextmenu="app.contextMenu"/>
<!--      <div-->
<!--          v-if="isSelecting"-->
<!--          class="selection-box"-->
<!--          :style="{-->
<!--        left: selectionBox.x + 'px',-->
<!--        top: selectionBox.y + 'px',-->
<!--        width: selectionBox.w + 'px',-->
<!--        height: selectionBox.h + 'px'-->
<!--      }"-->
<!--      />-->
    </div>

    <Docker></Docker>

  </div>

</template>

<style scoped>


.window {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: linear-gradient(135deg, #a6c1ee 0%, #fbc2eb 50%, #a6c1ee 100%);
}

.window-title {
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


.selection-box {
  position: fixed;
  border: 1px #3399ff solid;
  background-color: rgba(51, 153, 255, 0.2);
  pointer-events: none;
}

</style>