<script setup lang="ts">
import ViewContainerV2 from "@/components/Container/ViewContainerV2.vue";

const emit = defineEmits(['close'])
const props = defineProps<{
  id:string,
  icon:string,
  title: string,
}>()


function close(){
  emit("close")
}


</script>

<template>
  <teleport to="#window-view">
    <ViewContainerV2 :title="props.title" :id="props.id" @close="close" :icon="icon">
      <div class="wallpaper">

      </div>
    </ViewContainerV2>
  </teleport>
</template>

<style scoped>

</style>