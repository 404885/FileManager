<script setup lang="ts">

import { ElDialog, ElInput } from "element-plus";
import { ref } from "vue";
import { cellProps } from "@/utils/type.ts";



const emit = defineEmits(['close'])
const props = defineProps<cellProps>()


const { top, left, height, width } = props.rect;
const dialogVisible = ref(props.dialogVisible)
const input = ref(props.data)



</script>

<template>
  <teleport to="body">
    <el-dialog
        v-model="dialogVisible"
        :modal="false"
        :style="{ position: 'fixed', top: `${top}px`, left: `${left}px`, zIndex: 9999, height: `${height}px`, width: `${2*width}px` }"
        :show-close="false">


      <template #default>
        <div class="dialog-content">
          <el-input v-model="input" class="el-input" autofocus />
        </div>
      </template>


    </el-dialog>
  </teleport>
</template>

<style scoped>


.dialog-content {
  height: 100%;
  display: flex;
  flex-direction: row;
  padding-left: 4px;
  align-items: center;
}




</style>