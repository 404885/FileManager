<script setup lang="ts">

import { ElDialog,ElButton} from "element-plus";
import {ref} from "vue";

const emit = defineEmits(['close'])

const props = defineProps<{
  dialogVisible: boolean
  cellId: string
  tag: string
  position: { top: number; left: number }
  height: number
}>()

const dialogVisible = ref(props.dialogVisible)


</script>

<template>

  <teleport to="body">
    <el-dialog
        v-model="dialogVisible"
        :modal="false" class="model"
        :style="{ position: 'fixed', top: `${props.position.top}px`, left: `${props.position.left}px`, zIndex: 9999,  }"
        :show-close="false">

      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <h4 :id="titleId" :class="titleClass">This is a custom header!</h4>
          <el-button type="danger" @click="close">Close</el-button>
        </div>
      </template>

      <span>{{ props.tag }}</span>
      {{ props.position }}

    </el-dialog>
  </teleport>

</template>

<style scoped>

.my-header{
  width: 100%;
  display: flex;
  justify-content: space-between;
}


:deep(.el-dialog__header){
  padding: 0;
}


:deep(.el-dialog){
  margin: 0;
}



</style>