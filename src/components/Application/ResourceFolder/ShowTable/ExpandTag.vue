<script setup lang="ts">

import {ElDialog, ElInput, ElTag} from "element-plus";
import { ref } from "vue";
import { cellProps } from "@/utils/type.ts";



const emit = defineEmits(['close'])
const props = defineProps<cellProps>()


const { top, left, height, width } = props.rect;
const dialogVisible = ref(props.dialogVisible)


const tagSplit = (tag?: string | null) => {
  if (!tag) return []
  return tag.split(/[,，]/) .map(t => t.trim()).filter(t => t.length > 0) // 过滤掉空字符串
}

console.log(props.data.tag)

</script>

<template>
  <teleport to="body">
    <el-dialog
        v-model="dialogVisible"
        :modal="false"
        :style="{ position: 'fixed', top: `${top}px`, left: `${left}px`, zIndex: 9999, height: `2${height}px`, width: `${1.5*width}px` }"
        :show-close="false">


      <template #default>
        <div class="dialog-content">
          <div class="content-title">
            <el-tag
              v-for="tag in tagSplit(props.data.tag)"
              :key="tag"
              class="tag-item"
              type="primary">
            {{ tag }}
          </el-tag>
          </div>
          <div class="content-option">

          </div>

        </div>
      </template>


    </el-dialog>
  </teleport>
</template>

<style scoped>


.dialog-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  align-items: center;
}




</style>