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
    <div class="window-bar">
      <SideBar/>
      <component :is="currentComponent" v-if="currentComponent"/>
    </div>
    <div class="window-content">
      <RouterView/>
    </div>
  </div>



</template>

<style scoped>
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

.window-main{
  display: flex;
  flex-direction: row;
  height: calc(100vh - 32px);
  padding: 0 12px 12px;
  background: #f5f5f5; /* 更柔和的灰色 */
}
.window-bar {
  display: flex;
  flex-direction: row;
  gap: 6px;
}

.window-content{
  padding: 10px;
  min-width: 200px;
  flex: 1;
  background: white;
  margin-left: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06); /* 内容区也给一点阴影和圆角 */
}
</style>