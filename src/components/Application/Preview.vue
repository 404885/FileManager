<script setup lang="ts">
import ViewContainerV2 from "@/components/Container/ViewContainerV2.vue";
import PDFPreview from "@/components/Application/Preview/PDFPreview.vue";
import {onMounted, ref} from "vue";

const emit = defineEmits(['close'])
const props = defineProps<{
  id: string,
  icon: string,
  title: string,
  type: string,
  src: string
}>()

const buffer = ref()
onMounted(() => {
  window.electronAPI.openFileByPath(props.src).then(result =>{
    if (result.success){
      buffer.value = result.buffer
    }else {
      console.error(result.error)
    }
  })
})

</script>

<template>
  <teleport to="#window-view">
    <ViewContainerV2 :title="props.title" @close="emit('close')" :id="props.id" :icon="icon">
      <PDFPreview :src="buffer"/>
    </ViewContainerV2>
  </teleport>
</template>

<style scoped>

</style>