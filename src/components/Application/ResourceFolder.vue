<script setup lang="ts">

import ViewContainer from "@/components/Container/ViewContainer.vue";
import {onMounted, ref} from 'vue'
import Icon from "@/components/Container/Icon.vue";
import {Component, Data, vResize} from "@/utils";
import TableContainer from "@/components/Container/TableContainer.vue";
import PathContainer from "@/components/Container/PathContainer.vue";
import TreeContainer from "@/components/Container/TreeContainer.vue";

const emit = defineEmits(['close'])
const props = defineProps<{
  title: string,
}>()

const show = ref(true)


function open() {
  Component.openDialog({
    type: "add",
    props:{
      title: "创建实体"
    }
  })
}



onMounted(() =>  {
})



</script>

<template>
  <teleport to="#app" v-if="show">
    <ViewContainer :title="props.title" @close="show = false">
      <div class="resource">
          <div class="resource-sidebar" v-resize="{ storageKey: 'my-panel-width' }">
            <div class="resource-sidebar-title">快捷节点</div>
            <div class="resource-sidebar-section">
              <div v-for="(item, index) in Data.nodeData" :key="index" class="resource-sidebar-section-item">
                <Icon :type="item.icon"  source="bar"/>
                <span>{{ item.label }}</span>
              </div>
            </div>
            <div class="resource-sidebar-title">工作空间</div>
            <div class="resource-sidebar-tree">
              <TreeContainer></TreeContainer>
            </div>
          </div>
          <div class="resource-container">
            <div class="resource-container-bread">

              <div class="resource-container-bread-path">
                <PathContainer></PathContainer>
              </div>

              <div class="resource-container-bread-button animate_press" @click="open">新增</div>
            </div>
            <div class="resource-container-table">
              <TableContainer></TableContainer>
            </div>
          </div>
        </div>
    </ViewContainer>
  </teleport>
</template>


<style>
.resource {
  display: flex;
  flex-direction: row;
  flex: 1;
  user-select: none;
  height: calc(100% - 32px);
}

.resource-sidebar {
  display: flex;
  flex-direction: column;
  min-width: 180px;
  width: 180px;
  height: 100%;
  border-right: 1px solid #D2D2D7;
}
.resource-sidebar-title {
  margin: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #6E6E73;
}
.resource-sidebar-section {
  margin-left: 8px;
  margin-right: 8px;
  font-size: 14px;
}
.resource-sidebar-section-item {
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
  padding: 6px 12px;
  border-radius: 6px;
  color: #4B4B4F;
  cursor: pointer;
  transition: background 0.2s;
}
.resource-sidebar-section-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.resource-sidebar-tree{
  flex: 1;
  overflow-x: auto;
}
.resource-sidebar-tree::-webkit-scrollbar {
  display: none;
}
.resource-sidebar-tree-node {
  display: flex;
  gap: 4px;
  width: 100%;
  align-items: center;
}


.resource-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 408px;
  padding: 0 12px 12px;
  background: transparent;
}
.resource-container-table {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  border-radius: 6px;
  background: transparent;
  overflow-x: auto;
}
.resource-container-bread {
  min-height: 46px;
  width: 100%;
  display: flex;

  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  background: transparent;
  font-size: 14px;
}
.resource-container-bread-path{
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 3px;
  padding: 0 12px;

  display: flex;
  justify-content: center;
  align-items: center;
}
.resource-container-bread-button{
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 3px;
  padding: 0 12px;

  display: flex;
  justify-content: center;
  align-items: center;
}

</style>

