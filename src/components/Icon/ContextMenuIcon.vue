<script setup lang="ts">
import {ContextMenuRow} from "@/utils/type.ts";

defineProps<{
  row:ContextMenuRow
}>()

</script>

<template>
  <div class="menu-row" @click="row.click">
    <svg class="menu-row-icon" aria-hidden="true">
      <use :href="'#icon-'+row.icon" />
    </svg>
    <span class="menu-row-text">{{row.name}}</span>
  </div>
</template>

<style scoped>
.menu-row{
  display: flex;
  flex-direction: row;
}
.menu-row-icon{
  width: 20px;
  height: 20px;
  margin: auto 10px auto 0;
}
.menu-row-text{
  margin: auto 0;
  user-select: none;
}
</style>