<script setup lang="ts">
import {ref, onMounted } from 'vue'
import { ElTree } from 'element-plus'
import { useTreeCondition } from "@/pinia/TreeCondition.ts";
import { ElTreeNode } from "@/utils/type.ts";



//pinia初始化
const store = useTreeCondition()
const TreeData = ref<ElTreeNode[]>([])

// 绑定el-tree实例
const treeRef = ref()
// 注解传入tree的data

// 表格初始化
const initData = async () => {
  TreeData.value = await window.electronAPI.dataOperation.loadTree(store.currentWorkspace)
}


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
}

.highlight {
  color: #bfbf7b;
}

</style>


