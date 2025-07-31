<script lang="ts">
import {defineComponent} from "vue";

defineComponent({
  name: "BottomBar",
})

</script>

<template>
  <div class="window-bottom-controls">
    <div class="window-controls">
      <svg class="win-button" aria-hidden="true">
        <use href="#icon-windows8" />
      </svg>
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
.window-controls {
  display: flex;
  height: 36px;
  width: 36px;
}
.window-controls:hover {
  background: rgba(255, 255, 255, 0.91);
  fill: #007aff;
}
.win-button{
  margin: auto;
  width: 1em;
  height: 1em;
}
</style>