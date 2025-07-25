<script setup lang="ts">
import {onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
import { useRoute } from 'vue-router'
import router from "@/router";

import {ArrowDown, ArrowRight} from '@element-plus/icons-vue'

import Icon from "@/components/Container/Icon.vue";
import { VxeTableEvents, VxeTableInstance } from "vxe-pc-ui/types/components/table";
import { VxeColumnPropTypes } from "vxe-pc-ui/types/components/column";
import { VXETableNode } from "@/utils/type.ts";
import { useTreeCondition } from "@/pinia/TreeCondition.ts";

import { Component, Util } from "@/utils";
import ViewContainer from "@/components/Container/ViewContainer.vue";
import TreeContainer from "@/components/Container/TreeContainer.vue";



const props = defineProps({
  isComponent: Boolean,
})


const route = useRoute()
const store =useTreeCondition()
// 当前工作区的名称
// const currentWorkspaceTitle = ref('')
// 表格展示数据
const tableData = ref<VXETableNode[]>([])
const tableRef = ref<VxeTableInstance>()
// 筛选选项数组（用于生成下拉菜单）
const tabs = ref<any[]>([{type:'全部文件'}])
// 当前选中的筛选标签
let activeTab = reactive({type:'全部文件'})
// 下拉菜单可见状态
const dropdownVisible = ref(false)
// 响应式存储表格高度
const tableHeight = ref(0)
// 面包屑路径地址
const pathArray = ref<any[]>([])

// router.push({ path: '/space', query: { w: 1, f: 22 } })




// 计算函数
function updateTableHeight() {
  tableHeight.value = window.innerHeight - 152
}

// 时间戳转换为可读的形式
const timeFormatter: VxeColumnPropTypes.Formatter = ({ cellValue }) => {
  return typeof cellValue === 'number' ? Util.formatter.timeFormatter(cellValue) : '';
}

// 读取特定工作空间下面的文件夹中的文件数据
const loadTable = async (workspace: number, associatedFolder:number | null = null) => {
  tableData.value = await window.electronAPI.dataOperation.loadTable(workspace,associatedFolder)
}

// 表格初始化
const initTable = async (workspace: number) => {
  // 进入之前浏览的文件夹中，切换页面保留
  await router.push({path: '/space', query: {w: store.currentWorkspace, f: store.currentFolder}})
  // 读取存在的文件类型
  const types= await window.electronAPI.dataOperation.queryAll('SELECT DISTINCT type FROM file WHERE connected_workspace = ? LIMIT 5',[workspace])
  tabs.value.push(...types)
  tableData.value = await window.electronAPI.dataOperation.loadTable(workspace)
}



// 对列的双击事件
const handleDoubleClick: VxeTableEvents.CellClick<VXETableNode> = ({ row }) => {
  if(row.type === 'folder'){

    Util.setAndJump(row.connected_workspace, row.id, router)
    // tree跟随展开
    store.addExpandedNode("p_"+row.id)
  }else {
    console.log('开发中')
  }
}



function handleClick(index: number) {
  const w = pathArray.value[index].workspace
  const f = pathArray.value[index].id

  Util.setAndJump(w, f, router)
}


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
  Component.openDialog({
    type: "add",
    props:{
      title: "创建实体"
    }
  })
}


watch([() => route.query.f, () => route.query.w], async () => {
  pathArray.value = await Util.idToPathList(store.currentFolder, store.currentWorkspace)
  if (route.path === '/space' && route.query.f === '-1') { tableData.value = await window.electronAPI.dataOperation.loadTable(store.currentWorkspace) }
  else{ await loadTable(store.currentWorkspace, store.currentFolder)}
})


store.$subscribe(async(mutation, _state) => {
  const events = mutation.events
  if ((Array.isArray(events) && events.some(e => e.key === 'changedState')) || (!Array.isArray(events) && events.key === 'changedState')) {
    tableData.value = await window.electronAPI.dataOperation.loadTable(store.currentWorkspace)
    await Util.setAndJump(store.currentWorkspace, -1, router)
    store.setChangedState(-1)
  }
})






onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  updateTableHeight()
  window.addEventListener('resize', updateTableHeight)
  if(props.isComponent){
    console.log("dsa")
  }
  else {
    initTable(store.getCurrentWorkSpace)
  }

});



onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTableHeight)
})


</script>

<template>
  <ViewContainer>
    <TreeContainer></TreeContainer>
    <div class="mainView-table">
      <div class="mainView-bread">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item v-for="(item, index) in pathArray" :key="item.id" @click="handleClick(index)">{{ item.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <button class="newFile border-btn" @click="open">新增</button>
      </div>
      <div class="table-content">
        <div class="vxe-table">
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
        </div>
      </div>
    </div>
  </ViewContainer>
</template>

<style scoped>

.mainView-table {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #f5f5f5;
  height: 100%;
}

.mainView-bread {
  background: #fff;
  height: 42px;
  border-radius: 6px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06); /* 内容区也给一点阴影和圆角 */
}

.table-content {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  flex: 1;
  padding: 12px 16px;
}




.dropper .el-dropdown-link {
  cursor: pointer;
}
.newFile {
  height: 28px;
}
</style>
