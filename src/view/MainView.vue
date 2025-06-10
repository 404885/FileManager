<script setup lang="ts">
import { openDialog } from "@/utils/Dialog.ts";

 function open() {
   openDialog({
     type: "openFile",
     modalProps:{
       title: "创建实体"
     }
   })

}

</script>

<template>
  <button @click="open">打开</button>
</template>

<style scoped>

</style>