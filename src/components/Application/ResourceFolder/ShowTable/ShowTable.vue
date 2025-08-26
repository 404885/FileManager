<script setup lang="ts">

import Table from "@/components/Application/ResourceFolder/ShowTable/Table.vue";
import BreadCrumb from "@/components/Application/ResourceFolder/ShowTable/BreadCrumb.vue";



const props = defineProps<{
  id: string;
}>()

console.log(props.id)


</script>

<template>

  <div class="resource-container">
    <div class="resource-container-bread">
      <div class="resource-container-bread-path">
        <BreadCrumb></BreadCrumb>
      </div>
      <div class="resource-container-bread-button animate_press" @click="open">新增</div>
    </div>

    <div class="resource-container-table">
      <Table :id="props.id"></Table>
    </div>

  </div>

</template>

<style scoped>


.resource-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 408px;
  padding: 0 12px 8px;
  background: transparent;
}
.resource-container-table {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  border-radius: 6px;
  background: transparent;
  will-change: width;
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