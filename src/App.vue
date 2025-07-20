<script setup lang="ts">
import { RouterView } from 'vue-router'
import TitleBar from "@/components/Bar/TitleBar.vue";
import Icon from "@/components/Container/Icon.vue";
import {IconData} from "@/utils";


const dataTop = IconData.sideTopData

</script>

<template>
  <div class="window-title">
    <TitleBar/>
  </div>
  <div class="window-home">
    <div class="window-view">
      <RouterLink v-for="item in dataTop" :to="item.to" class="menu-icon">
        <Icon  :type="item.icon" source="bar"/>
      </RouterLink>
      <router-view/>
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
  background: url('https://picsum.photos/1200/800') center center / cover no-repeat;
}


</style>