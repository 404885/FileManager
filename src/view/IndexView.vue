<script setup lang="ts">
import {onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
import {ArrowDown, ArrowRight} from '@element-plus/icons-vue'
import {VxeTableEvents, VxeTableInstance} from "vxe-pc-ui/types/components/table";
import {VxeColumnPropTypes} from "vxe-pc-ui/types/components/column";
import formatter from "@/utils/formatter.ts"
import {openDialog} from "@/utils/component/Dialog.ts";
import {VXETableNode} from "@/utils/type.ts";
import {useTreeCondition} from "@/pinia/TreeCondition.ts";
import Icon from "@/components/Icon.vue";

const timeFormatter: VxeColumnPropTypes.Formatter = ({ cellValue }) => {
  return typeof cellValue === 'number' ? formatter.timeFormatter(cellValue) : '';
}


const store =useTreeCondition()

const currentWorkspaceTitle = ref('')  // 存放最终标题

const tableData = ref<VXETableNode[]>([])

watch(() => store.getCurrentWorkSpace, async (id) => {
      // 每次工作空间变了，就去查名字
      try {
        const row = await window.electronAPI.dataOperation.queryOne(
            'SELECT name FROM workspace WHERE id = ?',
            [id]
        )
        currentWorkspaceTitle.value = row?.name || '未命名工作空间'
      } catch (e) {
        currentWorkspaceTitle.value = '加载失败'
        console.error(e)
      }
    },
    { immediate: true }
)


const initTable = async (workspace: number) => {
  const types= await window.electronAPI.dataOperation.queryAll('SELECT DISTINCT type FROM file WHERE connected_workspace = ?',[workspace])
  tabs.value.push(...types)
  console.log(types)
  console.log(tabs.value)
  tableData.value = await window.electronAPI.dataOperation.loadTable(workspace)
}

const loadTable = async (workspace: number, associatedFolder:number | null = null) => {
  tableData.value = await window.electronAPI.dataOperation.loadTable(workspace,associatedFolder)
}

const tabs = ref<any[]>([{type:'全部文件'}])

const handleDoubleClick: VxeTableEvents.CellClick<VXETableNode> = ({ row }) => {
  console.log(row)
  if(row.type === 'folder'){
    loadTable(row.connected_workspace,row.id)
  }else {
    console.log('开发中')
  }
}

const dropdownVisible = ref(false)
let activeTab = reactive({type:'全部文件'})

function handleVisibleChange(visible: boolean) {
  dropdownVisible.value = visible
}

async function handleDropdownClick(index: number) {
  activeTab = tabs.value[index];
  if (activeTab.type === '全部文件'){
    tableData.value = await window.electronAPI.dataOperation.loadTable(store.getCurrentWorkSpace)
  }else {
    console.log('开发中')
  }
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

function open() {
  openDialog({
    type: "add",
    props:{
      title: "创建实体"
    }
  })

}


// 响应式存储表格高度
const tableHeight = ref(0)

// 计算函数
function updateTableHeight() {
  tableHeight.value = window.innerHeight - 152
}


onMounted(() => {
  document.addEventListener('click', handleClickOutside);

  updateTableHeight()
  window.addEventListener('resize', updateTableHeight)

  initTable(store.getCurrentWorkSpace)
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTableHeight)
})
</script>

<template>
  <el-container>
    <el-header class="workspace-header">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">{{currentWorkspaceTitle}}</el-breadcrumb-item>
        <el-breadcrumb-item>实习</el-breadcrumb-item>
      </el-breadcrumb>
      <button class="newFile" @click="open">新增</button>
    </el-header>
    <el-main class="workspace-main">
      <vxe-table
          ref="tableRef"
          border="none"
          :data="tableData"
          :show-header="true"
          show-overflow
          :row-config="{isCurrent: true, isHover: true}"
          :column-config="{resizable: true}"
          :virtual-y-config="{enabled: true, gt: 0}"
          :height="tableHeight"
          @cell-dblclick="handleDoubleClick"
          style="--vxe-ui-table-header-background-color:white;">
        <vxe-column field="name" title="文件名" fixed="left">
          <template #header>
            <el-dropdown class="dropper" trigger="click" @visible-change="handleVisibleChange" @command="handleDropdownClick">
              <span :class="['el-dropdown-link',]">
                {{activeTab.type}}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                      v-for="(tab,index) in tabs"
                      :key="index"
                      :command="index">
                    {{tab.type}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #default="{row}">
            <Icon :type="row.type" :is-leaf="row.type !== 'folder'" source="tree"/>
            {{row.name}}
          </template>
        </vxe-column>
        <vxe-column field="create_time" title="创建时间" width="150px" :formatter="timeFormatter" fixed="right"/>
        <vxe-column field="last_browse_time" title="上次浏览时间" width="150px" :formatter="timeFormatter" fixed="right"/>
        <template #empty>
          你个懒鬼，这个工作空间什么都没有
        </template>
      </vxe-table>
    </el-main>
  </el-container>
</template>

<style scoped>
.workspace-header{
  display: flex;
  flex-direction: row;
  user-select: none;
  justify-content: space-between; /* 上下两端对齐，留出中间空白 */
  align-items: center
}
.workspace-main{
  background-color: white;
  user-select: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.dropper .el-dropdown-link {
  cursor: pointer;
}
.newFile{
  height: 36px;
}

</style>
