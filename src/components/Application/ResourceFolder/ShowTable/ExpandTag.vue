<script setup lang="ts">

import {ElDialog, ElDivider, ElTag, ElInput} from "element-plus";
import { ref } from "vue";
import { cellProps } from "@/utils/type.ts";
import IconContainer from "@/components/Container/IconContainer.vue";



const emit = defineEmits(['close'])
const props = defineProps<cellProps>()

const input = ref('')


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
              closable
              type="primary">
              {{ tag }}
            </el-tag>
            <el-input v-model="input" class="tag-input" placeholder="Enter Tag ..."/>
          </div>
          <el-divider></el-divider>
          <div class="content-option">
            <span class="option-text">当前工作空间的tag</span>
            <div class="option-item" v-for="i of 4">
              <input type="checkbox" />
              <el-tag
                  v-for="tag in tagSplit(props.data.tag)"
                  :key="tag"
                  type="primary">
                {{ tag }}
              </el-tag>
            </div>
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

.content-title {
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 5px;
  column-gap: 10px;
  justify-content: start;
  align-items: center;
}

.tag-item {
  box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.1),  /* 较轻的阴影 */
      0 1px 4px rgba(0, 0, 0, 0.1);  /* 适中的模糊 */
}
.tag-input {
  flex: 1;
  min-width: 85px;
}




.content-option {
  width: 100%;
}

.option-text {
  font-size: 12px;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 5px;
}

.option-item {
  background-color: transparent;
  border-radius: 4px;
  height: 32px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  padding-left: 6px;
  gap: 14px;
}

.option-item:hover {
  background-color: #e0e0e0;
}


:deep(.el-input__wrapper) {
  padding: 0;
}

</style>