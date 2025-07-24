<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {Component, Data, Util} from "@/utils";
import Icon from "@/components/Container/Icon.vue";
import { ElPopover } from 'element-plus'
import {VXETableNode} from "@/utils/type.ts";
import {useTreeCondition} from "@/pinia/TreeCondition.ts";


const store = useTreeCondition()
const tableData = ref<VXETableNode[]>([])


const Fields = ref([
  { label: '名称', key: 'name' },
  { label: '创建时间', key: 'create_time' },
  { label: '上次浏览', key: 'last_browser-time' },
])


async function fieldContext(e: MouseEvent, index: any) {
  const data = [{ label: '属性', key: 'distribution' ,disabled: false}, { label: '删除', key: 'delete', disabled: false},]
  if (Fields.value[index].key === 'name') {
    data.find(i => i.key === 'delete')!.disabled = true
  }

  const result = await Component.openMenuAsync({
    type: 'contextMenuV1',
    props: {
      x: e.x,
      y: e.y,
      data: data,
      title: Fields.value[index].key
    }
  })

  if (result && result.key === 'delete') {
    if (Fields.value[index].key === 'name') {
      return
    }
    Fields.value.splice(index, 1)  // 删除字段
  }
}

// 表格初始化
const initTable = async () => {
  tableData.value = await window.electronAPI.dataOperation.loadTable(store.currentWorkspace)
}

function test(path:string){
  console.log(path)
}

function itemClick(item: any) {
  if (!Fields.value.some(f => f.key === item.key)) {
    Fields.value.push(item)
  }
}
function isClicked(item: any) {
  return Fields.value.some(f => f.key === item.key)
}

onMounted(() => {
  initTable()
})

</script>

<template>
  <div class="table-container">
    <div class="table-container-head" :style="{ gridTemplateColumns: `repeat(${Fields.length}, 1fr) 60px` }">
      <div class="table-container-head-item" v-for="(item,index) of Fields" @contextmenu="fieldContext($event, index)">{{item.label}}</div>
      <el-popover placement="right-end" >
        <template #reference>
          <div class="table-container-head-item">+</div>
        </template>
        <template #default>
          <div class="context-menu" ref="container">
            <div class="context-menu-item" v-for="item of Data.headData" @click="itemClick(item)" :class="{ disabled: isClicked(item) }">{{item.label}}</div>
          </div>
        </template>
      </el-popover>
    </div>
    <div class="table-container-body">
      <div class="table-container-body-row" :style="{ gridTemplateColumns: `repeat(${Fields.length}, 1fr) 60px` }" v-for="row of tableData">
        <div class="table-container-body-row-cell" v-for="item of Fields" @click="test(row)">
          <template v-if="item.key === 'name'" >
            <Icon :type=row.type  source="bar"/>
            <span>{{ row[item.key] }}</span>
          </template>
          <template v-if="item.key === 'create_time'">
            {{ Util.formatter.timeFormatter(Number(row[item.key])) }}
          </template>
        </div>
        <div class="table-container-body-row-cell"></div>
      </div>
      <div class="table-container-body-fill"></div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  height: 100%;

  min-width: 100%;
  max-width: 100%;

  background: transparent;
  overflow: hidden;
  font-size: 14px;
  display: flex;
  flex-direction: column;

}

.table-container-head {
  background: transparent;
  min-height: 40px;
  display: grid;
}
.table-container-head-item{
  flex: 1;
  flex: 1 auto;
  background: rgba(255, 255, 255, 0.4);
  padding: 10px;
  font-size: 15px;


  display: flex;
  justify-content: center;
  align-items: center;
}
.table-container-head-item:hover {
  background: rgba(0, 0, 0, 0.06);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1);
}
.table-container-head-item:active {
  transform: scale(0.95);
  background: rgba(0, 0, 0, 0.08);
}
.table-container-head-item:first-child{
  border-top-left-radius: 6px;
}
.table-container-head-item:last-child{
  border-top-right-radius: 6px;
}

.table-container-body{
  flex: 1;
  display: flex;
  flex-direction: column;
  background: transparent;
  overflow: auto;
  scrollbar-width: none;
}
.table-container-body-row{
  background: rgba(255, 255, 255, 0.3);
  display: grid;
}
.table-container-body-row:hover {
  background: rgba(0, 0, 0, 0.03);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1);
}
.table-container-body-fill{
  flex: 1;
  background: rgba(255, 255, 255, 0.3);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
.table-container-body-row-cell {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 10px;
  position: relative;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.table-container-body-row-cell:hover::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid rgba(0, 0, 0, 0.2); /* 较深的边框 */
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1); /* 轻微光晕 */
  background-color: rgba(0, 0, 0, 0.02); /* 微微深色背景 */
  pointer-events: none;
}







.context-menu {
  width: 100%;
  border-radius: 6px;
  padding-left: 4px;
  padding-right: 4px;
  font-size: 14px;
  user-select: none;
  z-index: 1000;
  transition: box-shadow 0.3s ease;
}
.context-menu-item {
  padding: 6px 6px 6px 10px;
  margin: 4px 0;
  border-radius: 3px;
  font-size: 13px;
  cursor: pointer;
  color: #000000;
  background: transparent;
  transition: background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
  user-select: none;
}
.context-menu-item:hover {
  background-color: #ebebeb; /* 浅灰色背景 */
  color: #000000; /* 保持文字颜色不变，或换成 #333 更柔和 */
}
.context-menu-item.disabled {
  background-color: #f0f0f0;
  color: #aaa;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
  font-style: italic;
}

</style>