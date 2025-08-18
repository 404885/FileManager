<script setup lang="ts">
import { Util } from "@/utils";
import {onMounted, ref, computed} from "vue";
import {VXETableNode} from "@/utils/type.ts";
import {useTreeCondition} from "@/pinia/TreeCondition.ts";


const store = useTreeCondition()
const breadData = ref<VXETableNode[]>([])


// 表格初始化
const initData = async () => {
  breadData.value = await Util.idToPathList(store.currentFolder, store.currentWorkspace)
}
// 点击面包屑实现跳转
const breadClick = (id: number) => {
  store.setCurrentFolder(id)
}



onMounted(() =>  {
  initData()
});

store.$subscribe((mutation, state) => {
  console.log('变化了！', mutation, state)
  initData()
})




const visibleBreadData = computed(() => {
  const list = breadData.value
  if (list.length <= 4) return list

  return [
    list[0],
    { name: '...', id: 'ellipsis' },
    ...list.slice(-2)
  ]
})


</script>


<template>

  <div class="breadCrumb">
    <template v-for="(item, index) in visibleBreadData" :key="index">
      <div class="breadCrumbItem">
        <div class="navItem" :style="{ cursor: item.name === '...' ? 'default' : 'pointer' }" @click="breadClick(item.id)">
          {{ item.name }}
        </div>
      </div>
      <span v-if="index < visibleBreadData.length - 1" class="separator">/</span>
    </template>
  </div>
</template>


<style scoped>

.breadCrumb {
  display: flex;
  flex-direction: row;
  gap: 5px;

  justify-content: center; /* 水平居中 */
  align-items: center;
}

.breadCrumbItem {
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.navItem {
  font-size: 14px;
  color: #333;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: all 0.1s ease-in-out;
  user-select: none;

}

.navItem:hover {
  background-color: #f0f0f0;
  color: #409EFF;
}

.navItem:active {
  transform: scale(0.96);
  background-color: #e6f0ff;
}


.separator {
  margin: 0 6px;
  color: #aaa;
}


</style>