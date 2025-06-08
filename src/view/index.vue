<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {ArrowDown} from '@element-plus/icons-vue'
import {VxeTableInstance} from "vxe-pc-ui/types/components/table";
import {VxeColumnPropTypes} from "vxe-pc-ui/types/components/column";
import formatter from "@/utils/formatter.ts"

interface RowVO {
  id: number
  name: string
  createTime: number
  browseTime: number
  image:string
}

const timeFormatter: VxeColumnPropTypes.Formatter = ({ cellValue }) => {
  return typeof cellValue === 'number' ? formatter.timeFormatter(cellValue) : '';
}

const tableData = reactive<Partial<RowVO>[]>([
  { id: 10001, name: '《实验指导手册》实验10.Ansible源码编译安装(综合5)', createTime: Date.now() - 31 * 24 * 60 * 60 * 1000, browseTime: Date.now()},
  { id: 10002, name: 'Test2', createTime: Date.now(), browseTime:Date.now() - 31 * 24 * 60 * 60 * 1000},
  { id: 10003, name: 'Test3', createTime: Date.now()},
  { id: 10004, name: 'Test4', createTime: Date.now()}
])

const tabs=[
  {
    name:"Latest_Browse",
    title:"最近浏览",
  },
  {
    name:"PDF",
    title:"PDF"
  },
  {
    name:"WebPage",
    title:"网页"
  },
]

const dropdownVisible = ref(false)
let activeTab = reactive({name: "Latest_Browse",title:"最近浏览"})
function handleVisibleChange(visible: boolean) {
  dropdownVisible.value = visible
}
function handleDropdownClick(index: number) {
  activeTab=tabs[index];
}

const tableRef = ref<VxeTableInstance>()

const handleClickOutside = (event: MouseEvent) => {
  if (tableRef.value) {
    const table = tableRef.value
    const tableEl = table.$el;
    if (tableEl && !tableEl.contains(event.target as Node)) {
      table.clearCurrentRow();
    }
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

</script>

<template>
  <el-container>
    <el-header class="workspace-header">
      <h2>工作空间</h2>
    </el-header>
    <el-main class="workspace-main">
      <vxe-table
          ref="tableRef"
          border="none"
          :data="tableData"
          :show-header="true"
          show-overflow
          :row-config="{isCurrent: true, isHover: true}"
          style="--vxe-ui-table-header-background-color:white;">
        <vxe-column field="name" title="文件名" fixed="left">
          <template #header>
            <el-dropdown class="dropper" trigger="click" @visible-change="handleVisibleChange" @command="handleDropdownClick">
              <span :class="['el-dropdown-link',]">
                {{activeTab.title}}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                      v-for="(tab,index) in tabs"
                      :key="index"
                      :command="index">
                    {{tab.title}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </vxe-column>
        <vxe-column field="browseTime" title="上次浏览时间" width="150px" :formatter="timeFormatter" fixed="right"/>
        <vxe-column field="createTime" title="创建时间" width="150px" :formatter="timeFormatter" fixed="right"/>
      </vxe-table>
    </el-main>
  </el-container>
</template>

<style scoped>
.workspace-header{
  display: flex;
  flex-direction: row;
  user-select: none;
}
.workspace-main{
  background-color: white;
}
.dropper .el-dropdown-link {
  cursor: pointer;
}

</style>
