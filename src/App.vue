<script setup lang="ts">
import TitleBar from "@/components/Bar/TitleBar.vue";
import { Util,Data } from "@/utils";
import BottomBar from "@/components/Bar/BottomBar.vue"
import {computed, nextTick, onMounted, ref, watch} from "vue";
import DeskTopIcon from "@/components/Icon/DeskTopIcon.vue";
import { useDeskTopCondition } from "@/pinia/DeskTopCondition.ts";
import {DESKTOP_ICON_SIZE} from "@/utils/constant.ts";
import {useClickHandler} from "@/utils/util.ts";
import {Applications} from "@/utils/type.ts"
import MenuContainerV1 from "@/components/Container/MenuContainerV1.vue";



const applications = Data.applicationData
// 容器引用 & 宽度
const desktop = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const backgroundVideo = ref<HTMLVideoElement | null>(null)
const deskTopStore =useDeskTopCondition()


async function onRightClick(e: MouseEvent) {
  e.stopPropagation()
  const result = await Util.asyncOpenComponent(MenuContainerV1,'桌面右键菜单', {
    position: { x: e.clientX, y: e.clientY },
    data:  [
      { name: "Option 1", icon: "icon1", click: () => {}},
      { name: "Option 2", icon: "icon2", click: () => {}},
      { name: "Option 3", icon: "icon2", click: () => {}},
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
               src="./assets/video/meme.mp4"
               :muted="false"/>
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
  background-image: url('https://via.placeholder.com/150');
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
  z-index: 9999;
  width: 100%;
}


</style>