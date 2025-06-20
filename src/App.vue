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

</style>