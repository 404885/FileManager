<script setup lang="ts">
import { Util } from "@/utils";
import {onMounted, ref} from "vue";
import {VXETableNode} from "@/utils/type.ts";
import {useTreeCondition} from "@/pinia/TreeCondition.ts";


const store = useTreeCondition()
const breadData = ref<VXETableNode[]>([])


// 表格初始化
const initData = async () => {
  breadData.value = await Util.idToPathList(store.currentFolder, store.currentWorkspace)
}

onMounted(() =>  {
  initData()
});

store.$subscribe((mutation, state) => {
  console.log('变化了！', mutation, state)
  initData()
})

</script>

<template>
  <div class="breadCrumb">
    <nav v-for="(item, index) of breadData" class="breadCrumbItem">
      <div class="navItem">{{ item.name }}</div>
      <span v-if="index < breadData.length - 1" class="separator">></span>
    </nav>
  </div>
</template>

<style scoped>

.breadCrumb {
  display: flex;
  flex-direction: row;
  gap: 5px;
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