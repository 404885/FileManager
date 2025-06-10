<script setup lang="ts">
import { openDialog } from "@/utils/Dialog.ts";

async function openAndReadFile() {
  const result = await window.electronAPI.openFileDialog()
  if (!result.canceled) {
    this.filePath = result.filePath ?? ''
    this.fileContent = result.content ?? ''
    // 你也可以绑定内容到页面上
  } else {
    alert('用户取消了选择')
  }
}

 function open() {
   openDialog({
     type: "openFile",
     props:{},
     modalProps:{
       title: "创建实体"
     }
   })

}

</script>

<template>
  {{ filePath }}
  {{ fileContent }}
  <button @click="openAndReadFile">打开并读取文件</button>
  <button @click="open">打开</button>
</template>

<style scoped>

</style>