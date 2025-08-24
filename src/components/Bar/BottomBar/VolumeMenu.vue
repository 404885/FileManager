<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, nextTick, watch} from 'vue'
import {useDeskTopCondition} from "@/pinia/DeskTopCondition.ts";

const deskTopStore = useDeskTopCondition()

const props = defineProps<{
  type:string,
}>()

watch(()=>deskTopStore.volume,(newValue,_oldValue)=>{
  if (Number(newValue) !== 0)
    deskTopStore.unMute()
},{immediate:true})

const BottomBarMenu = ref<HTMLElement | null>(null)

function handleClickOutside(e: MouseEvent) {
  // 更健壮：如果没有元素直接 return
  const el = BottomBarMenu.value
  if (!el) return
  if (!el.contains(e.target as Node)) {
    deskTopStore.setActivateMenu()
  }
}
const target = ref<string | null>(null)
onMounted(() => {
  // 用 pointerdown 也可以更早拦截，按需替换
  nextTick(() => {
    if (document.querySelector('#window-view')) {
      target.value = '#window-view'
    }
  })
  document.addEventListener('pointerup', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerup', handleClickOutside)
})
</script>

<template>
  <Teleport v-if="target" :to="target">
    <transition name="el-zoom-in-bottom">
      <div v-if="deskTopStore.getActivateMenu===props.type" class="BottomBarMenu" ref="BottomBarMenu">
        <div class="volumeMenu-wrapper">
          <div class="volumeMenu">
            <svg class="icon" aria-hidden="true" @pointerdown="deskTopStore.mute()">
              <use :href="'#icon-'+deskTopStore.getVolumeIcon"/>
            </svg>
            <input class="volume-slider" type="range" min="0" max="1" step="0.01"
                   v-model.number="deskTopStore.volume"
                   :style="{ '--percent': (deskTopStore.volume * 100) + '%' }"/>
            <span class="volume-number">{{(deskTopStore.volume * 100).toFixed(0)}}</span>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.BottomBarMenu{
  z-index: 9999;
}
.volumeMenu-wrapper{
  position: absolute;
  width: 300px;
  height: 80px;
  bottom: 36px;
  right: 0;
  display: flex;
  flex-direction: column;
  background: rgba(230, 230, 230, 0.8);
  box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.05);
  user-select: none;
}
.volumeMenu{
  display: flex;
  flex-direction: row;
  margin: auto;
}
.icon{
  margin-top: auto;
  width: 1.5em;
  height: 1.5em;
}
.volume-slider{
  -webkit-appearance: none;
  appearance: none;
  width: 200px;
  height: 2px;
  padding: 10px;
  background: transparent;
}
/* 轨道 */
.volume-slider::-webkit-slider-runnable-track{
  height: 2px;
}

/* 滑块（需要指定尺寸，否则你看不到变化） */
.volume-slider::-webkit-slider-thumb{
  -webkit-appearance: none;
  appearance: none;
  width: 5px;
  height: 16px;
  background: #409eff;
  border-radius: 3px;

  border: none;
  margin-top: -6px; /* 让滑块在轨道中垂直居中 */
}
.volume-slider::-webkit-slider-thumb:hover{
  background: #000000;
}
.volume-slider::-webkit-slider-runnable-track {
  background: linear-gradient(to right, #409eff var(--percent, 0%), #ccc var(--percent, 0%));
}
.volume-number{
  display: flex;
  width: 10px;
}
</style>
