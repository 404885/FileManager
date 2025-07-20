<script setup lang="ts">
import { ref } from 'vue'
import TheadMenu from "@/components/Menu/TheadMenu.vue";

const Fields = ref([
  { label: '名称', key: 'name' },
  { label: '创建事件', key: 'name' },
  { label: '上次浏览', key: 'name' }
])


function itemReceive(item: any) {
  console.log('父组件接收到点击：', item)
  // 判断当前 item.key 是否已经存在，避免重复添加
  const exists = Fields.value.some(field => field.key === item.key)
  if (!exists) {
    Fields.value.push(item) // 如果没有重复，添加字段
  }
}

</script>

<template>
  <table class="table-container">

    <thead>
      <tr class="table--container-header">
        <th v-for="item of Fields">{{item.label}}</th>
        <el-popover class="box-item" placement="right">
          <template #reference>
            <th @click="">+</th>
          </template>
          <template #default>
            <TheadMenu @select="itemReceive" />
          </template>
        </el-popover>
      </tr>
    </thead>


    <tbody>
<!--    <tr v-for="(row, index) in tableData" :key="index" @dblclick="handleDoubleClick(row)">-->
<!--      <td class="name-cell">-->
<!--        <Icon :type="row.type" :is-leaf="row.type !== 'folder'" source="tree" />-->
<!--        {{ row.name }}-->
<!--      </td>-->
<!--      <td>{{ timeFormatter(row.create_time) }}</td>-->
<!--      <td>{{ timeFormatter(row.last_browse_time) }}</td>-->
<!--    </tr>-->
<!--    <tr v-if="tableData.length === 0">-->
<!--      <td colspan="3" class="empty-cell">你个懒鬼，工作空间什么都没有</td>-->
<!--    </tr>-->
    </tbody>

  </table>
</template>

<style scoped>
.table-container {
  width: 100%;
  border: none;
  border-collapse: collapse;
  background: transparent;
  overflow: hidden;
  font-size: 14px;
}

.table-container th,
.table-container td {
  padding: 10px 16px;
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  color: #333;
}

.table-container th {
  background: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.empty-cell {
  text-align: center;
  font-style: italic;
  color: #999;
  padding: 20px;
}

.table-container tr {
  transition: background-color 0.25s ease-out, box-shadow 0.25s ease-out;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0); /* 初始就有个透明阴影 */
}

.table-container tr:hover {
  background-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}
</style>