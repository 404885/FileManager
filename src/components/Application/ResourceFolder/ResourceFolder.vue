<script setup lang="ts">
import { Data, Util, vResize } from "@/utils";
import ViewContainerV2 from "@/components/Container/ViewContainerV2.vue";
import SwitchDialog from '../../Dialog/SwitchDialog.vue';
import IconContainer from "@/components/Container/IconContainer.vue";
import ShowTable from "@/components/Application/ResourceFolder/View/ShowTable/ShowTable.vue";




const emit = defineEmits(['close'])
const props = defineProps<{
  id: string,
  icon: string,
  title: string,
}>()



const itemClick = (action: string) => {
  switch (action) {
    case 'spaceChange': {
      console.log('切换工作空间')
      Util.openComponent(SwitchDialog,'切换', {})
      break
    }
  }
}

const close = () => {
  emit('close')

}

const context = (e: MouseEvent) => {
  e.stopPropagation()
}

</script>

<template>
  <teleport to="#window-view">
    <ViewContainerV2 :title="props.title" :id="props.id" :icon="props.icon" @close="close" @contextmenu="context">
      <div class="resource">
          <div class="resource-sidebar" v-resize="{ storageKey: 'my-panel-width', max: 300, min: 100}">

            <div class="resource-sidebar-title">快捷节点</div>
            <div class="resource-sidebar-section">
              <div v-for="(item, index) in Data.nodeData" :key="index" class="resource-sidebar-section-item" @click="itemClick(item.action as string)">
                <span>{{ item.label }}</span>
                <IconContainer size="20px" :link-mode="false" :name="item.icon"/>
              </div>
            </div>
          </div>


        <ShowTable :id="props.id"></ShowTable>


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
  flex: 1;
  overflow-y: auto;
  /* 隐藏滚动条 - Webkit 浏览器 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
}
.resource-sidebar-section::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
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

  justify-content: space-between;
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




</style>

