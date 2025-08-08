<script setup lang="ts">
import Icon from "@/components/Container/Icon.vue";
import {Component, Data, Util, vResize} from "@/utils";
import TableContainer from "@/components/Container/TableContainer.vue";
import PathContainer from "@/components/Container/PathContainer.vue";
import TreeContainer from "@/components/Container/TreeContainer.vue";
import ViewContainerV2 from "@/components/Container/ViewContainerV2.vue";
import SwitchDialog from '../Dialog/SwitchDialog.vue';

const emit = defineEmits(['close'])
const props = defineProps<{
  id: string,
  icon: string,
  title: string,
}>()


function close(){
  emit("close")
}


function open() {
  Component.openDialog({
    type: "add",
    props:{
      title: "创建实体"
    }
  })
}

const itemClick = (action: string) => {
  switch (action) {
    case 'spaceChange': {
      console.log('切换工作空间')
      Util.openComponent(SwitchDialog,'切换', {})
      break
    }
  }
}

</script>

<template>
  <teleport to="#window-view">
    <ViewContainerV2 :title="props.title" :id="props.id" :icon="icon" @close="close">
      <div class="resource">
          <div class="resource-sidebar" v-resize="{ storageKey: 'my-panel-width', max: 300, min: 100}">
            <div class="resource-sidebar-title">快捷节点</div>
            <div class="resource-sidebar-section">
              <div v-for="(item, index) in Data.nodeData" :key="index" class="resource-sidebar-section-item" @click="itemClick(item.action as string)">
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
    </ViewContainerV2>
  </teleport>
</template>


<style>
.resource {
  display: flex;
  flex-direction: row;
  flex: 1;
  user-select: none;
  height: 100%;
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
  max-width: 300px;
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

