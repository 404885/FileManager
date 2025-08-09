<script setup lang="ts">

import { ref } from 'vue'
import ViewContainerV2 from "@/components/Container/ViewContainerV2.vue";

const emit = defineEmits(['close'])
const props = defineProps<{
  title: string,
}>()

const show = ref(true)







</script>

<template>
  <teleport to="#window-view" v-if="show">
    <ViewContainerV2 :title="props.title" @close="show = false">



    </ViewContainerV2>
  </teleport>
</template>


<style>


</style>

