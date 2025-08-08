<script setup lang="ts">
import ContextMenu from '@/components/Container/ContextMenuContainer.vue'
import {CSSProperties, reactive} from "vue";
import {ContextMenuRow} from "@/utils/type.ts";
import ContextMenuIcon from "@/components/Icon/ContextMenuIcon.vue";
import {Util} from "@/utils";
import WallPaper from "@/components/Application/WallPaper.vue";

const emit = defineEmits(['close'])
defineProps<{
  position: { x: number, y: number },
  customStyle?: CSSProperties
}>()

const close = ()=>{
  emit("close")
}

const rows = reactive<ContextMenuRow[]>([
  {
    name:"壁纸",
    icon:"wallpaper_roll",
    click(){
      Util.openComponent(WallPaper,'壁纸',{title:"壁纸设置",icon:this.icon})
      close()
    },
  },
])

</script>

<template>
  <teleport to="body">
    <ContextMenu :position="position" :customStyle="{}" @close="close">
      <ContextMenuIcon v-for="(row,index) in rows" :key="index" :row="row"/>
    </ContextMenu>
  </teleport>
</template>

<style scoped>

</style>
