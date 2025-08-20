<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from "vue";
import BottomBarIcon from "@/components/Icon/BottomBarIcon.vue";
import {useDeskTopCondition} from "@/pinia/DeskTopCondition.ts";
import Sortable from "sortablejs";

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

function iconHover(e: MouseEvent,hoverColor: string) {
  const el = e.currentTarget as HTMLElement
  el.style.background = 'rgba(255, 255, 255, 0.91)'
  el.style.fill = hoverColor
}
function iconLeave(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.background = ''
  el.style.fill = ''
}

let clockTimer: number | null = null
const midControls = ref<HTMLDivElement|null>(null)
onMounted(() => {
  update()
  clockTimer = window.setInterval(update, 1000)

  if (midControls.value) {
    Sortable.create(midControls.value, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      chosenClass: 'sortable-chosen',
      forceFallback: true, // 必须开这个才能禁止 clone
      onEnd: (evt) => {
        const newOrder = [...deskTopStore.bottomBarOrder]
        const [moved] = newOrder.splice(evt.oldIndex!, 1)
        newOrder.splice(evt.newIndex!, 0, moved)
        deskTopStore.setBottomBarOrder(newOrder)
      },
    })
  }
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})
</script>

<template>
  <div class="window-bottom-controls">
    <div class="left-controls">
      <BottomBarIcon v-for="(control,_index) in controls" :key="_index" :icon="control.icon" @hover="iconHover($event,control.hoverColor)" @leave="iconLeave"/>
    </div>
    <div class="mid-controls" ref="midControls">
      <BottomBarIcon
          v-for="(app) in deskTopStore.getBottomBarApps"
          :key="app.id"
          :icon="app.icon"
          :width="'1.5em'"
          :height="'1.5em'"
          @click="toggleWindow(app.id)"
          @hover="iconHover"
          @leave="iconLeave"
      />
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
.sortable-drag {
  opacity: 1 !important;
}

.sortable-chosen {
  background: rgba(255, 255, 255, 0.4);
  opacity: 0.8; /* 选中的时候稍微暗一点（可选） */
}
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