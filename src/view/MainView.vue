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
  <div class="box" v-drag>拖动我</div>
  <div v-drag>test</div>
  <button @click="open" v-drag>打开</button>
  <button @click="connect">connect</button>
</template>

<style scoped>
.box {
  width: 100px;
  height: 100px;
  background: lightblue;
  cursor: move;
  user-select: none;
}
.box.dragging {
  opacity: 0.5;
}
</style>