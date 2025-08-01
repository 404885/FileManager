<script lang="ts" setup>

import {onMounted, ref} from "vue";
import BottomBarIcon from "@/components/Icon/BottomBarIcon.vue";

const controls = ref([
  {
    icon:'windows8',
    hoverColor:'#007aff',
  },
  {
    icon:'to_do',
    hoverColor:'',
    onClick:(event:MouseEvent)=>{
      console.log(event.type)
    }
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

onMounted(()=>{
  update()
  setInterval(update, 1000)
})
</script>

<template>
  <div class="window-bottom-controls">
    <template v-for="(control,_index) in controls" :key="_index">
      <BottomBarIcon :control="control"/>
    </template>
    <div class="right-controls">
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
      <BottomBarIcon :control="{icon:'comments'}"/>
    </div>
  </div>
</template>

<style scoped>
.window-bottom-controls {
  display: flex;
  flex-direction: row;
  min-height: 36px;
  background: rgba(255, 255, 255, 0.55);
  box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.05);
  background-blend-mode: overlay; /* 增强层次感 */
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