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
    <button class="window-btn close" @click="close"></button>
    <button class="window-btn minimize" @click="minimize"></button>
    <button class="window-btn maximize" @click="maximize"></button>
    <button class="window-btn pin" :class="{ pinned: isPinned }" @click="toggle"></button>
  </div>
</template>

<style scoped>

</style>