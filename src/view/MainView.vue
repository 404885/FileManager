<script setup lang="ts">
import { openDialog } from "@/utils/component/Dialog.ts";

 function open() {
   openDialog({
     type: "addFile",
     modalProps:{
     },
     props:{
       title: "创建实体"
     }
   })

}

function connect(){
  window.electronAPI.dataOperation.prepare();
  console.log("saa")
}

</script>

<template>
  <button @click="open">打开</button>
  <button @click="connect">connect</button>
</template>

<style scoped>

</style>