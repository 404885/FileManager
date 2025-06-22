<script setup lang="ts">
import {ref, watch, onMounted } from 'vue'
import { openMenu } from "@/utils/component/Menu.ts";
import Icon from "@/components/Icon.vue";
import {showNotification} from "@/utils/component/Notification.ts";
import {LoadFunction} from "element-plus";



interface ElTreeNode {
  id: number;
  label: string;
  children?: ElTreeNode[];
  isLeaf?: boolean;
  fullPath?: string;
  size?: number;
}

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


// el-tree props 配置
const defaultProps = {
  isLeaf: 'isLeaf',
  label: 'label',
}

// 监听过滤值变化，并调用回调函数向过滤方法中传值
watch(filterText, (val) => {
  treeRef.value?.filter(val)
})

// 自定义过滤函数（回调函数传入值，el-tree的全部树节点）
// const filterNode = (value: string, data: TreeNode) => {
//   if (!value) return true
//   return data.label.toLowerCase().includes(value.toLowerCase())
// }


// 初始化加载树结构
const load: LoadFunction = async (node, resolve, _reject) => {
  // 只有第一次加载根节点时，显示 loading
  if (node.level === 0) {
    isLoading.value = true;
    const data = await window.electronAPI.dataOperation.lazyLoad(1, 0);
    resolve(data);
    isLoading.value = false;
    return;
  }

  if (node.level >= 1) {
    const child = await window.electronAPI.dataOperation.lazyLoad(
        node.data.connected_workspace,
        node.data.id
    );
    resolve(child);
  }
};


const allowDrop = (draggingNode: { data: ElTreeNode }, dropNode: { data: ElTreeNode }, dropType: 'prev' | 'inner' | 'next') => {
  if(draggingNode.data.id == dropNode.data.id) {
    return false
  }
  if (dropType === 'inner' && dropNode.data.isLeaf) {
    console.log(dropNode.data)

    return false
  }
  return dropType === 'inner'
}


const end = (draggingNode: { data: ElTreeNode }, dropNode: { data: ElTreeNode }, e: any, el:any) => {
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

// 页面弹窗
function onRightClick(e: MouseEvent, data: ElTreeNode) {
  e.preventDefault()
  openMenu({
    positionX: e.clientX,
    positionY: e.clientY,
  })
  console.log(data)
  treeRef.value?.setCurrentKey(data.id)
}

</script>

<template>
  <div class="window-detail-wrapper" v-resizable="{ min: 180, max: 600 }">
    <div class="window-detail">
      <input class="detail-filter" v-model="filterText" placeholder="Filter keyword"/>
      <div class="folder">快捷节点</div>
      <div class="folder">工作空间</div>
      <el-tree
              v-loading="isLoading"
              element-loading-text="加载数据中"
              ref="treeRef"
              class="file-tree"
              :load="load"
              lazy
              node-key="id"
              :props="defaultProps"
              draggable
              :allow-drop="allowDrop"
              @node-contextmenu="onRightClick"
              @node-drag-end="end"
              :indent="16">
            <template #default="{ node, data }">
              <div class="test">
                <Icon :label="data.label" :is-leaf="data.isLeaf" :level="String(node.level)"/>
                <span>
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



</style>


