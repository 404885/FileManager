<script lang="ts" setup>
import {onMounted, ref} from "vue";
import BottomBarIcon from "@/components/Icon/BottomBarIcon.vue";
import {useDeskTopCondition} from "@/pinia/DeskTopCondition.ts";
const deskTopStore = useDeskTopCondition()

const controls = ref([
  {
    icon:'windows8',
    hoverColor:'#007aff',
  },
])

const currentTime = ()=>{
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1)
  const d = String(now.getDate())
  const h = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  return [`${y}/${m}/${d}`,`${h}:${min}:${s}`]
}

const date =ref<string>()
const time =ref<string>()
function update() {
  const [d, t] = currentTime()
  date.value = d
  time.value = t
}

const toggleVolume = () => {
  const newVolume = deskTopStore.volume === 0 ? 0.1 : 0
  deskTopStore.setVolume(newVolume)
}

function toggleWindow(id: string) {
  if (deskTopStore.isMinimized(id)) {
    deskTopStore.restoreWindow(id)
  } else {
    deskTopStore.minimizeWindow(id)
  }
}

onMounted(()=>{
  update()
  setInterval(update, 1000)
})
</script>

<template>
  <div class="window-bottom-controls">
    <div class="left-controls">
      <BottomBarIcon v-for="(control,_index) in controls" :key="_index" :icon="control.icon" :hover-color="control.hoverColor"/>
    </div>
    <div class="mid-controls">
      <BottomBarIcon v-for="(app,_index) in deskTopStore.getApp"
                     :key="app.id"
                     :icon="app.icon"
                     :width="'1.5em'"
                     :height="'1.5em'"
                     @click="toggleWindow(app.id)"/>
    </div>
    <div class="right-controls">
      <BottomBarIcon :icon="deskTopStore.volume === 0 ? 'no_audio' : 'volume'" @click="toggleVolume"/>
      <div class="time-wrapper">
        <div class="time">
          <span class="hour">
            {{time}}
          </span>
          <span class="date">
            {{date}}
          </span>
        </div>
      </div>
      <BottomBarIcon :icon="'comments'"/>
    </div>
  </div>
</template>

<style scoped>
.window-bottom-controls {
  display: flex;
  flex-direction: row;
  min-height: 36px;
  background: rgba(230, 230, 230, 0.8);
  box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.05);
}
.left-controls{
  display: flex;
  flex-direction: row;
}
.mid-controls{
  display: flex;
  flex-direction: row;
}
.right-controls{
  margin-left: auto;
  display: flex;
  flex-direction: row;
}
.time-wrapper{
  font-size: 12px;
  height: 36px;
  position: relative;
}
.time{
  display: flex;
  flex-direction: column;
  padding: 3px 10px 0 10px;
}
.time-wrapper:hover{
  background: rgba(255, 255, 255, 0.91);
  user-select: none;
}
</style>