<script setup lang="ts">
import { Data } from "@/utils";
import { ElTable, ElTableColumn } from 'element-plus'
import {onMounted, ref} from "vue";
import { VXETableNode } from "@/utils/type.ts";


const tableData = ref<VXETableNode[]>([])



// 表格初始化
const initData = async () => {
  tableData.value = await window.electronAPI.dataOperation.loadTable(store.currentWorkspace, store.currentFolder)
}



onMounted( async () => {
  tableData.value = await window.electronAPI.dataOperation.loadTable(store.currentWorkspace)
})



</script>

<template>
  <div style="display: flex; flex-direction: column; height: 100%;">
    <el-table :data="tableData" height="250" style="flex: 1; min-height: 0;">
      <el-table-column prop="label" label="Date" width="180" />
      <el-table-column prop="icon" label="Name" width="180" />
      <el-table-column prop="key" label="Address" />
    </el-table>
  </div>

</template>

<style scoped>

:deep(.el-table) {
  background: rgba(255, 255, 255, 0.4);
  box-shadow:
      0 8px 20px rgba(0, 0, 0, 0.35),
      0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}



/* 表头 hover 效果 */
:deep(.el-table__header-wrapper th:hover) {
  background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(240,240,240,0.9));
  backdrop-filter: blur(6px);
  color: #333;
  font-weight: 600;
  transition: background 0.25s ease, color 0.25s ease;
}
:deep(.el-table__header th:active) {
  transform: translateY(1px) scale(0.98);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  background-color: #e9ecf1;
}



</style>