<script setup lang="ts">
import {ElDialog} from "element-plus";
import {ref, watch} from "vue";


const emit = defineEmits(['close'])
const props = defineProps<{
  id: string;
  dialogVisible: boolean;
}>()

const dialogVisible = ref<boolean>(props.dialogVisible);


watch(dialogVisible,  async (newVal) => {
  if (!newVal) {
    emit("close")
  }
});

</script>

<template>
  <teleport to="body">
    <el-dialog v-model="dialogVisible" :show-close="false" align-center :style="{height: '400px', width: '600px'}">
      <template #default>dsa</template>
    </el-dialog>
  </teleport>
</template>

<style scoped>

::v-deep(.el-dialog__header) {
  padding-bottom: 10px !important;
  display: block !important;
}

</style>