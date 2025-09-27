<template>
  <div class="table-v2-container">
    <el-table-v2
        :columns="columns"
        :data="data"
        :width="700"
        :height="300"
        class="transparent-el-table-v2"/>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { ElTableV2 } from 'element-plus';

// --- 模拟数据 ---
const data = reactive(
    Array.from({ length: 200 }).map((_, index) => ({
      id: index + 1,
      name: `用户 ${index + 1}`,
      age: 20 + (index % 10),
      city: `城市 ${index % 5 + 1}`,
    }))
);

// --- 列配置 ---
const columns = reactive([
  { key: 'id', dataKey: 'id', title: 'ID', width: 80, align: 'center', resizable: true },
  { key: 'name', dataKey: 'name', title: '姓名', width: 200, resizable: true },
  { key: 'age', dataKey: 'age', title: '年龄', width: 100 },
  { key: 'city', dataKey: 'city', title: '所在城市', width: 320 },
]);
</script>

<style scoped>

</style>