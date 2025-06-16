<script setup lang="ts">
import {openMenu} from "@/utils/component/Menu.ts";
import { Draggable } from '@he-tree/vue'
import {ref} from "vue";

const treeRef = ref()
const treeData = ref([
  {
    text: 'Projects',
    children: [
      {
        text: 'Frontend',
        children: [
          {
            text: 'Vue',
            children: [
              {
                text: 'Nuxt',
              },
            ],
          },
          {
            text: 'React',
            children: [
              {
                text: 'Next',
              },
            ],
          },
          {
            text: 'Angular',
          },
        ],
      },
      {
        text: 'Backend',
      },
    ],
  },
  { text: 'Photos' },
  { text: 'Videos' },
])

function onRightClick(e: MouseEvent) {
  e.preventDefault()
  openMenu({
    positionX: e.clientX,
    positionY: e.clientY,
  })
}

function handleDragOver(DragNode) {
  console.log(DragNode)
}

function Over(e: DragEvent) {
  console.log("nihao")
}

</script>

<template>
  <div class="window-detail-wrapper" v-resizable="{ min: 180, max: 600 }" @contextmenu="onRightClick">
    <div class="window-detail">
<!--      <BaseTree v-model="treeData" />-->
      <Draggable
          v-model="treeData"
          ref="treeRef"
          :treeLine="true"
          :keepPlaceholder="false"
          @before-drag-start="handleDragOver"
          @enter="Over"

      />
    </div>
  </div>
</template>

<style scoped>
.window-detail-wrapper {
  display: flex;
  background: var(--menu-bg);
  border-right: 1px solid var(--menu-border);
  flex-direction: column;
}

.window-detail {
  flex: 1;
  padding: 5px;
  user-select: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

::v-deep(.drag-placeholder){
  display: none;
}



</style>