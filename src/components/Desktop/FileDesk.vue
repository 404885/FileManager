<script setup lang="ts">

import {ref, watch, onMounted } from 'vue'

import Icon from "@/components/Container/Icon.vue";

import { ElTreeNode } from "@/utils/type.ts";
import { useTreeCondition } from "@/pinia/TreeCondition.ts";
import {Component, IconData, Util} from "@/utils"
import router from "@/router";
import { useRoute } from "vue-router";



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



async function load() {
  try {
    isLoading.value = true
    data.value = await window.electronAPI.dataOperation.loadTree(store.currentWorkspace)
    isLoading.value = false
  } catch (err) {
    console.error('加载目录结构失败:', err)
    isLoading.value = false
  }
}


// 挂载的时候默认调用load初始化
onMounted(()=>{
  load()
})


</script>

<template>
  <div class="aa fadeIn-slide">
    <div class="fileDesk-sidebar">
      <div class="fileDesk-controls">
        <button class="window-btn close" @click=""></button>
        <button class="window-btn minimize" @click=""></button>
        <button class="window-btn maximize" @click=""></button>
      </div>
      <div class="fileDesk-tree">
        <el-tree
            v-loading="isLoading"
            element-loading-text="加载数据中"
            ref="treeRef"
            class="tree"
            :data="data"
            node-key="uniqueKey"
            :props="defaultProps"
            draggable
            :allow-drop="allowDrop"
            @node-contextmenu="contextmenu"
            @node-drag-end="end"
            @node-drop="drop"
            :default-expanded-keys="store.expandedNode"
            @node-expand="expand"
            @node-collapse="collapse"
            :expand-on-click-node="false"
            :highlight-current="false"
            :indent="16">
          <template #default="{ node, data }">
            <div class="tree-node" @click="handleClick(node, onSingleClick, onDoubleClick)">
              <Icon :type="data.type" :is-leaf="data.isLeaf" source="tree"/>
              <span :title="data.label"  :class="{ 'highlight': data.marked }">
                  {{ data.label }}
              </span>
            </div>
          </template>
        </el-tree>
      </div>
    </div>

    <div class="fileDesk-content">
      <div class="fileDesk-bread"></div>
    </div>



  </div>
</template>

<style scoped>
.aa {
  display: flex;
  flex-direction: row;
  background: white;
  width: 50%;  /* 宽度占父元素的80% */
  height: 50%; /* 高度占父元素的80% */
  margin: 10px;
  gap: 6px;
  box-sizing: border-box;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 🚀 核心：将元素自身向左和向上平移自身宽度和高度的50% */

  animation: fadeInSlide 0.5s ease-in-out forwards;
}

.fileDesk-sidebar{
  width: 100px;
}

.fileDesk-tree {

}

.window-controls {
  display: flex;
  flex-direction: row;
  gap: 8px;
  min-height: 32px;
}

.window-btn {
  margin-bottom: auto;
  margin-top: auto;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease;
}
.window-btn:hover {
  transform: scale(1.2);
}

.window-btn.close {
  background-color: #ff5f57;
}
.window-btn.minimize {
  background-color: #fdbc40;
}
.window-btn.maximize {
  background-color: #33c748;
}
.window-btn.pin {
  background-color: #b39ddb; /* 未固定：浅紫色 */
}
.window-btn.pinned {
  background-color: #4a148c; /* 已固定：深紫色 */
}


</style>
