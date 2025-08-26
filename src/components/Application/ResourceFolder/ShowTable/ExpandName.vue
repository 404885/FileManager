<script setup lang="ts">

import { ElDialog, ElInput } from "element-plus";
import { watch, ref } from "vue";
import { useResourceCondition } from "@/pinia/ResourceCondition.ts";
import { cellProps } from "@/utils/type.ts";
import IconContainer from "@/components/Container/IconContainer.vue";


const resFolder = useResourceCondition()

const emit = defineEmits(['close'])
const props = defineProps<cellProps>()


const { top, left, height, width } = props.rect;
const dialogVisible = ref(props.dialogVisible)
const input = ref(props.data.name)



watch(dialogVisible,  async (newVal) => {
  if (!newVal) {

    const tableName = props.data.type === 'folder' ? 'portfolio' : 'file';

    const result = await window.electronAPI.dataOperation.execute(
        `UPDATE ${tableName} SET name = ? WHERE ID = ?;`,
        [input.value, props.data.id]
    );

    console.log(result);

    if (result) {
      emit("close")
      resFolder.setDataChange(props.data)
    }


  }
});


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
          <IconContainer :link-mode="true" :file-type="props.data.type"></IconContainer>
          <el-input v-model="input" class="el-input" />
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
  padding-left: 7px;
  align-items: center;
}




</style>