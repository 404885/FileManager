<script setup lang="ts">
import {computed} from 'vue'
import { RouterView, useRoute } from 'vue-router'
import TitleBar from "@/components/Bar/TitleBar.vue";
import SideBar from "@/components/Bar/SideBar.vue";

import DetailSpace from "@/components/Bar/DetailSpace.vue";
import DetailTag from "@/components/Bar/DetailTag.vue";

const route = useRoute()

const componentMap = {
  space: DetailSpace,
  tag: DetailTag,
}

const currentComponent = computed(() => {
  const key = route.meta.DetailBar as keyof typeof componentMap
  return componentMap[key] || null
})

</script>

<template>
  <div class="window-title">
    <TitleBar/>
  </div>
  <div class="window-main">
    <SideBar/>
    <component :is="currentComponent" v-if="currentComponent"/>
    <div class="window-content">
      <RouterView/>
    </div>
  </div>



</template>

<style scoped>
.window-title {
  height: 32px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 12px;
  box-sizing: border-box;
  z-index: 9999;
  -webkit-app-region: drag;
}

.window-main{
  display: flex;
  flex-direction: row;
  flex: 1;
}

.window-content{
  padding: 10px;
  min-width: 200px;
  flex: 1;
}
</style>