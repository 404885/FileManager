<script setup lang="ts">
import {ref, watch, onMounted } from 'vue'
import { openMenu } from "@/utils/component/Menu.ts";
import Icon from "@/components/Icon.vue";
import {showNotification} from "@/utils/component/Notification.ts";
import {ElTreeNode} from "@/utils/type.ts";
import {useTreeCondition} from "@/pinia/TreeCondition.ts";

//pinia初始化
const store = useTreeCondition()
// input过滤文本
const filterText = ref('')
// 绑定el-tree实例
const treeRef = ref()
// 注解传入tree的data
const data = ref<ElTreeNode[]>([])
// 默认加载动画为false
const isLoading = ref<boolean>(false);
// 设置警告弹窗
const hasAlerted = ref(false)
//当前工作空间
const currentWorkspace = ref<number>(1)
// 计时器
let timer: ReturnType<typeof setTimeout> | null = null

// el-tree props 配置
const defaultProps = {
  children: 'children',
  label: 'label',
  path: 'path',
}



async function onSearch(workspace:number,keyword:string){
  isLoading.value = true
  data.value = await window.electronAPI.dataOperation.load(workspace,keyword)
  isLoading.value = false
}

async function load() {
  try {
    isLoading.value = true
    data.value = await window.electronAPI.dataOperation.load(currentWorkspace.value)
    isLoading.value = false
  } catch (err) {
    console.error('加载目录结构失败:', err)
    isLoading.value = false
  }
}


const allowDrop = (draggingNode: { data: ElTreeNode }, dropNode: { data: ElTreeNode }, dropType: 'prev' | 'inner' | 'next') => {
  // 给拖动节点添加高亮
  treeRef.value?.setCurrentKey(draggingNode.data.uniqueKey)
  if(draggingNode.data.uniqueKey == dropNode.data.uniqueKey) {
    return false
  }
  if (dropType === 'inner' && dropNode.data.isLeaf) {
    return false
  }
  return dropType === 'inner'
}


const end = (_draggingNode: { data: ElTreeNode }, dropNode: { data: ElTreeNode }, _e: any, _el:any) => {
  // 拖拽时间不允许，拖入节点为空
  if (!dropNode){
    if (!hasAlerted.value) {
      showNotification({
        message: '禁止拖入',
        type: 'error',
        duration: 3000,
        position: "bottom-right"
      })
      hasAlerted.value = true
      setTimeout(() => {
        hasAlerted.value = false
      }, 3000)
    }
  }
}



const drop = async (draggingNode: {data: ElTreeNode} , dropNode: {data: ElTreeNode}, _dropType: 'inner'|'prev'|'next', _event: DragEvent)=>{
  const tableName = draggingNode.data.isLeaf?'file':'portfolio'
  const parentId = dropNode.data.id === 0 ? null : dropNode.data.id;
  const result = await window.electronAPI.dataOperation.execute(
      `UPDATE ${tableName} SET associated_folder = ? WHERE ID = ?;`,
      [parentId,draggingNode.data.id]
  )
  // 更新成功
  if (result){
    // 通过pinia设置更新状态
    store.setChangedFolder(dropNode.data.id)
    return;
  }
}

// 页面弹窗
function onRightClick(e: MouseEvent, data: ElTreeNode) {
  e.preventDefault()
  openMenu({
    positionX: e.clientX,
    positionY: e.clientY,
  })
  treeRef.value?.setCurrentKey(data.uniqueKey)
}


// 搜索防抖
watch(filterText, async (val) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(async () => {
    await onSearch(currentWorkspace.value, val);
  }, 300)
})

// 通过getter监听state值变化后重设为默认值
watch(()=>store.getChangedFolder, async (_val) => {
  store.setChangedFolder(-1)
  await onSearch(currentWorkspace.value,filterText.value);
})

onMounted(()=>{
  load()
})

</script>

<template>
  <div class="window-detail-wrapper" v-resizable="{ min: 180, max: 600 }">
    <div class="window-detail">
      <input class="detail-filter" v-model="filterText" placeholder="Filter keyword"/>
      <div class="folder">快捷节点</div>
      <div class="folders">全部文档</div>
      <div class="folders">搜索结果</div>
      <div class="folders">收藏夹</div>
      <div class="folders">回收站</div>
      <div class="folders">草稿箱</div>
      <div class="folder">工作空间</div>
      <el-tree
              v-loading="isLoading"
              element-loading-text="加载数据中"
              ref="treeRef"
              class="file-tree"
              :data="data"
              node-key="uniqueKey"
              :props="defaultProps"
              draggable
              :allow-drop="allowDrop"
              @node-contextmenu="onRightClick"
              @node-drag-end="end"
              @node-drop="drop"
              :highlight-current="false"
              :indent="16">
            <template #default="{ node, data }">
              <div class="test">
                <Icon :label="data.label" :is-leaf="data.isLeaf" :level="String(node.level)"/>
                <span :class="{ 'highlight': data.marked }">
                  {{ data.label }}
                </span>
              </div>
            </template>
          </el-tree>
    </div>
  </div>
</template>

<style scoped>
.window-detail-wrapper {
  display: flex;
  background: var(--menu-bg);
  border-right: 1px solid var(--menu-border);
  flex-direction: column;
}

.window-detail {
  padding: 5px;
  user-select: none;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 33px);
  overflow: hidden;
}

.detail-filter {
  height: 30px;
  padding: 5px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}


.folder{
  font-size: 12px;
  color: grey;
  margin-bottom: 4px;
  margin-top: 4px;
  text-wrap: nowrap;
  overflow: hidden;
}

.folders{
  font-size: 14px;
  color: #444;
  align-items: center;
  cursor: pointer;
  margin-left: 16px;
}

/* 树背景和字体 */
.file-tree {
  background: #f9fbfd;
  font-size: 14px;
  flex: 1;
  color: #444;
  width: auto;
  overflow: auto;
  scrollbar-width: none;
  user-select: none;
  --el-tree-node-hover-bg-color: #e6f0ff; /* 轻微悬浮底色 */
}

.highlight {
  color: #bfbf7b;
}

</style>


