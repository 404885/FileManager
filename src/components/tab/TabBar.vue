<script setup lang="ts">

import {ArrowDownBold, Close, Plus, Search} from "@element-plus/icons-vue";
import Tab from "@/components/tab/Tab.vue";
import {computed, markRaw, reactive, ref, watch} from "vue";
import Index from "@/view/index.vue";

const active = ref(0)

const tabs = reactive([{ id: crypto.randomUUID(), title: '首页', icon: markRaw(Search), component:markRaw(Index)}]);
const currentComponent = computed(() => tabs[active.value]?.component)

watch(tabs, (newVal) => {
  if (newVal.length === 0){
    newVal.push({ id: crypto.randomUUID(), title: '首页', icon: markRaw(Search), component:markRaw(Index)})
    active.value = 0
  }
})
const handleTabClick = (index: number) => {
  active.value = index;
};
const handleTabClose = (index: number) => {
  tabs.splice(index, 1);
  if (active.value >= tabs.length) {
    active.value = tabs.length - 1;
  }
}

const handleAddTab = () => {
  tabs.push({ id: crypto.randomUUID(), title: '首页', icon: markRaw(Search), component:markRaw(Index)})
};

</script>

<template>
  <div class="tab-wrapper">
    <div class="tab-header-wrapper">
      <div class="tab-header">
        <div class="tab-header-nav">
          <div class="tab-header-nav-left-filler-wrapper" >
            <div class="tab-header-nav-lef-filler">
              <div class="tab-history-wrapper">
                <div class="tab-history">
                  <el-icon><ArrowDownBold /></el-icon>
                </div>
              </div>
              <slot name="leftFiller"></slot>
            </div>
          </div>
          <transition-group name="tab" tag="div" class="tab-header-nav-item-wrapper">
            <div :class="['tab-header-nav-item',{'is-active':active === index},{'hover-enabled':active !== index}]"
                 @click="handleTabClick(index)" v-for="(tab,index) in tabs" :key="tab.id">
              <Tab :text="tab.title" :icon="tab.icon"/>
              <el-icon class="tab-close-button" size="12px" @click.stop="handleTabClose(index)"><Close/></el-icon>
            </div>
            <div :class="['tab-header-nav-item-add','hover-enabled']" @click="handleAddTab" :key="'tab-add-button'">
              <el-icon class="tab-add-button" size="12px"><Plus/></el-icon>
            </div>
          </transition-group>

          <div class="tab-header-nav-right-filler-wrapper" v-if="$slots.rightFiller">
            <div class="tab-header-nav-right-filler">
              <slot name="rightFiller"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-content">
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<style scoped>
.tab-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}
.tab-header-wrapper{
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}
.tab-header{
  flex: 1 1 auto;
  min-width: 0;
}
.tab-header-nav{
  display: flex;
  flex-direction: row;
  background-color: rgba(193, 193, 193, 0.3);
}
.tab-header-nav-left-filler-wrapper{
  display: flex;
  margin-right: 10px;
}
.tab-header-nav-lef-filler{
  flex: 0 0 auto;
  margin: 5px 0 5px 0;
  display: flex;
}
.tab-history-wrapper{
  display: flex;
  flex: 1;
  margin-left: 5px;
  margin-right: 5px;
}
.tab-history{
  padding: 5px;
  border: 1px;
  border-radius: 5px;
}
.tab-history:hover{
  background-color: rgba(193, 193, 193, 0.5);
}
.tab-header-nav-item-wrapper{
  padding-top: 5px;
  display: flex;
  flex-direction: row;
  flex: 1;
  min-width: 0;
}
.tab-header-nav-item{
  container-type: inline-size;
  container-name: tab;
  display: flex;
  flex: 1 1 auto;
  min-width: 18px;
  margin: 0 1px 5px 1px;
  padding: 5px;
  cursor: pointer;
  position: relative;
  max-width: 150px;
  transition: background-color 0.3s ease-in-out;
  border: 1px;
  border-radius: 8px;
}
.tab-header-nav-item.hover-enabled:hover{
  background-color: rgba(193, 193, 193, 0.5);
}
.tab-close-button{
  position: absolute;
  top: 10px;
  right: 6px;
  padding: 1px;
  border: 1px;
  border-radius: 100px;
  transition: 0.3s all;
}
.tab-close-button:hover{
  background-color: rgba(159, 159, 159, 0.54);
}
.tab-header-nav-item-add{
  display: flex;
  flex: 1 1 auto;
  margin: 0 1px 5px 1px;
  padding: 5px;
  cursor: pointer;
  position: relative;
  max-width: 20px;
  transition: background-color 0.3s ease-in-out;
  border: 1px;
  border-radius: 8px;
  min-width: 20px;
}
.tab-header-nav-item-add.hover-enabled:hover{
  background-color: rgba(193, 193, 193, 0.5);
}
.tab-add-button{
  position: absolute;
  top: 10px;
  right: 8px;
  padding: 1px;
  border: 1px;
  border-radius: 100px;
  transition: 0.3s all;
}
.tab-header-nav-right-filler-wrapper{
  display: flex;
  margin-left: 20px;
}
.tab-header-nav-right-filler{
  flex: 0 0 auto;
  padding: 10px 0 10px 0;
}
.tab-content{
  display: flex;
  flex: 1;
  flex-direction: row;
}
.is-active{
  background-color: white;
}
.tab-move {
  transition: transform 0.3s ease;
}

.tab-enter-active, .tab-leave-active {
  transition: all 0.3s ease;
}
.tab-enter-from, .tab-leave-to {
  opacity: 0;
  transform: translateY(-10px); /* 或 translateX */
}
</style>