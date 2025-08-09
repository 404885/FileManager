<script setup lang="ts">
import MenuContainer from '@/components/Container/MenuContainer.vue'
import {CSSProperties, reactive} from "vue";
import {ContextMenuRow} from "@/utils/type.ts";
import ContextMenuIcon from "@/components/Icon/ContextMenuIcon.vue";

const emit = defineEmits(['close'])

const props = defineProps<{
  position: {x: number; y: number};
  customStyle?: CSSProperties;
}>()



const rows = reactive<ContextMenuRow[]>([
  {
    name:"打开",
    click:()=>{
      emit('close')
    },
  },
])

</script>

<template>
  <teleport to="body">
    <MenuContainer :position="props.position" :customStyle="props.customStyle" @close="emit('close')">
      <ContextMenuIcon v-for="(row,index) in rows" :key="index" :row="row"/>
    </MenuContainer>
  </teleport>
</template>

<style scoped>
</style>
