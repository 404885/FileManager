<script setup lang="ts">
// 1. 显式导入 Vxe Table 的核心组件
import { VxeTable, VxeColumn } from 'vxe-table';


// 你的数据保持不变
const tableData = [
  { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', address: 'Shenzhen' },
  { id: 10002, name: 'Test2', role: 'Test', sex: 'Man', address: 'Guangzhou' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' },

]

</script>

<template>
    <VxeTable
        :column-config="{ resizable: true }"
        border
        :data="tableData"
        height="100%"
        width="100%"
        header-cell-class-name="table-header-cell"
        header-row-class-name="table-header-row"
        cell-class-name="table-body-cell"
        row-class-name="table-body-row"
    >
      <VxeColumn type="seq" title="Seq" align="center" :width="48" :resizable="false">

      </VxeColumn>
      <VxeColumn field="name" title="Name"></VxeColumn>
      <VxeColumn field="sex" title="Sex"></VxeColumn>
      <VxeColumn field="address" title="Address"></VxeColumn>
      <VxeColumn field="flex" :resizable="false"></VxeColumn>
    </VxeTable>
</template>

<style scoped>
.table {
  height: 100%;
  width: 100%;
  overflow: auto;
}
.test {
  flex: 1;
}





</style>