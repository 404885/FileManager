<script setup lang="ts">
import ViewContainerV2 from "@/components/Container/ViewContainerV2.vue";
import PDFPreview from "@/components/Application/Preview/PDFPreview.vue";

const emit = defineEmits(['close'])
const props = defineProps<{
  id: string,
  icon: string,
  title: string,
  type: string,
}>()

function close(){
  emit("close")
}
</script>

<template>
  <teleport to="#window-view">
    <ViewContainerV2 :title="props.title" @close="close" :id="props.id" :icon="icon">
      <PDFPreview  :initialScale="1.0" :maxPageCssWidth="1200"
                    @loaded="e => console.log('pages:', e.numPages)"
                    @pagechange="p => console.log('current page:', p)"
                    @error="msg => console.error(msg)"
      />
    </ViewContainerV2>
  </teleport>
</template>

<style scoped>

</style>