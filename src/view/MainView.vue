<template>
  <div>
    <button @click="pickFile">选择文件</button>
    <button @click="pickDir">选择文件夹</button>
    <button @click="open">弹窗</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {openDialog} from "@/utils/Dialog.ts";


async function pickFile() {
  const res = await window.electronAPI.openFileDialog()
  if (!res.canceled) {
    console.log('文件路径:', res.filePath)
    console.log('文件信息:', res.stats)
  }
}

async function pickDir() {
  const res = await window.electronAPI.openDirectoryDialog()
  if (!res.canceled) {
    console.log('目录:', res.directory)
    console.table(res.files)
  }
}

function open(){
  openDialog()
}
</script>
