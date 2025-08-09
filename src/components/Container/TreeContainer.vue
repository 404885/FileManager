<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElTree } from 'element-plus'
import { useTreeCondition } from "@/pinia/TreeCondition.ts";
import { ElTreeNode } from "@/utils/type.ts";
import { Util } from "@/utils";
import IconContainer from "@/components/Container/IconContainer.vue";



//pinia初始化
const store = useTreeCondition()
const TreeData = ref<ElTreeNode[]>([])
// 点击事件并设置双击间隔
const { handleClick } = Util.useHandleClick(200)
// 绑定el-tree实例
const treeRef = ref()



// 单击事件处理
const onSingleClick = (node:any) => {
  console.log(node.data.uniqueKey)
  if(node.data.isLeaf) {
  }
  else {
    store.setCurrentFolder(node.data.id)
    node.expanded = !node.expanded

    if(node.expanded){
      if (node.data.uniqueKey && !store.expandedNode.includes(node.data.uniqueKey)) {
        store.addExpandedNode(node.data.uniqueKey)
      }
    }
    else {
      // 递归删除idList中的id，得到收起父节点，子节点直接关闭的效果
      const removeNodeAndChildren = (data: ElTreeNode) => {
        if (!data) return
        if (data.uniqueKey && !data.isLeaf && store.expandedNode.includes(data.uniqueKey)) {
          store.removeExpandedNode(data.uniqueKey)
        }
        if (data.children && data.children.length) {
          data.children.forEach(child => removeNodeAndChildren(child))
        }
      }
      removeNodeAndChildren(node.data)
    }
  }
}
// 双击事件处理
const onDoubleClick = async (node:any) => {
  if(node.data.isLeaf) {
  }
  else {
  }
}
// 表格初始化
const initData = async () => {
  TreeData.value = await window.electronAPI.dataOperation.loadTree(store.currentWorkspace)
}



store.$subscribe(async(mutation, _state) => {
  const events = mutation.events

  if ((Array.isArray(events) && events.some(e => e.key === 'changedState')) || (!Array.isArray(events) && events.key === 'changedState')) {
    await initData()
    store.setChangedState(-1)
  }
})



// 挂载的时候默认调用load初始化
onMounted( () =>{
  initData()
})

</script>

<template>
  <div class="detail-tree">
    <el-tree
            element-loading-text="加载数据中"
            ref="treeRef"
            class="tree"
            :data="TreeData"
            node-key="uniqueKey"
            draggable
            :default-expanded-keys="store.expandedNode"
            :expand-on-click-node="false"
            :highlight-current="false"
            :indent="16">
      <template #default="{ node, data }">
        <div class="tree-node" @click="handleClick(node, onSingleClick, onDoubleClick)">
          <IconContainer :file-type="data.type" size="16px" :link-mode="true"></IconContainer>
          <span :title="data.label"  :class="{ 'highlight': data.marked }">{{ data.label }}</span>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<style scoped>


.detail-tree {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}


.tree {
  overflow: auto;
  color: #444;
  max-width: 300px;
  user-select: none;
  scrollbar-width: none;
}

.tree-node {
  width: 100%;
  display: flex;
  align-items: center;
}

.highlight {
  color: #bfbf7b;
}

::v-deep(.svg-icon){
  margin-right: 4px;
}

</style>


