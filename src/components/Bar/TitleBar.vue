<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "TitleBar",
  data() {
    return {
      isPinned: false
    };
  },
  methods: {
    minimize() {
      window.electronAPI.windowControls.minimize();
    },
    maximize() {
      window.electronAPI.windowControls.maximize();
    },
    close() {
      window.electronAPI.windowControls.close();
    },
    toggle(){
      this.isPinned = !this.isPinned;
      window.electronAPI.windowControls.pinned(this.isPinned);
    }
  }
})
</script>

<template>
  <div class="window-controls">
    <button class="window-btn close" @click="close" title="关闭"></button>
    <button class="window-btn minimize" @click="minimize" title="最小化"></button>
    <button class="window-btn maximize" @click="maximize" title="最大化"></button>
    <button class="window-btn pin" :class="{ pinned: isPinned }" @click="toggle" title="固定"></button>
  </div>
</template>

<style scoped>
.window-controls {
  display: flex;
  flex-direction: row;
  gap: 8px;
  min-height: 32px;
  -webkit-app-region: no-drag;
}

.window-btn {
  margin-bottom: auto;
  margin-top: auto;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease;
}
.window-btn:hover {
  transform: scale(1.2);
}

.window-btn.close {
  background-color: #ff5f57;
}
.window-btn.minimize {
  background-color: #fdbc40;
}
.window-btn.maximize {
  background-color: #33c748;
}
.window-btn.pin {
  background-color: #b39ddb; /* 未固定：浅紫色 */
}
.window-btn.pinned {
  background-color: #4a148c; /* 已固定：深紫色 */
}
</style>