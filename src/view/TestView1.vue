<script setup lang="ts">

import ViewContainer from "@/components/Container/ViewContainer.vue";
import { ref } from 'vue'

const emit = defineEmits(['close'])
const props = defineProps<{
  title: string,
}>()


const show = ref(true)

</script>

<template>
  <teleport to="#app" v-if="show">
    <ViewContainer :title="props.title" @close="show = false">
    </ViewContainer>
  </teleport>
</template>


<style>

.info-dialog {
  position: fixed;
  top: 220px;
  left: 220px;
  width: 400px;   /* 固定宽度 */
  height: 300px;  /* 固定高度 */
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 9999; /* 确保在最上层 */
}

.dialog-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: 16px;
}

.view-container {
  border-radius: 6px;
  width:70%;
  height:80%;
  display: flex;
  flex-direction: column;

  position: absolute;
  left: 0;

  overflow: hidden;
  resize: both;

  min-width: 720px;
  min-height: 500px;
  will-change: transform;

  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.05);
  background-blend-mode: overlay; /* 增强层次感 */
  transition: background 0.3s ease;
}

.title-bar {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  min-height: 32px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  position: relative;
  cursor: grab;
  border-bottom: 1px solid #e0e0e0; /* Subtle separator */
  will-change: transform;
  background: transparent;
}

.traffic-lights {
  display: flex;
  gap: 8px;
  z-index: 100000;
}
.traffic-light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}
.traffic-light.red {
  background-color: #ff5f57;
}
.traffic-light.yellow {
  background-color: #ffbd2e;
}
.traffic-light.green {
  background-color: #28c940;
}
.traffic-light:hover {
  opacity: 0.8;
}

.title {
  font-size: 14px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;

}

</style>

