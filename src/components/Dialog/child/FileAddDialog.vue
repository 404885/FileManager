<script setup lang="ts">

import {ElNotification} from "element-plus";
import {useTreeCondition} from "@/pinia/TreeCondition.ts";

const props = defineProps({
  title: { type: String },
})

const store = useTreeCondition()

async function openAndReadFile() {
  const result = await window.electronAPI.openFileDialog()
  console.log(result)
  if (result.canceled) return;
  // 保存结构到数据库
  const data ={
    name:result.name,
    path:result.path,
    size:result.stats.size,
    birthtime:result.stats.birthtime,
    atime:result.stats.atime,
  }
  const callback=await window.electronAPI.dataOperation.saveFileToDb(data,1);

  store.setChangedFolder(0)

  if (callback.success){
    ElNotification.success({
      title:'成功',
      message:'文件已经导入成功',
      position:'bottom-right'
    })
  }else {
    ElNotification.error({
      title:'失败',
      message:'文件导入失败',
      position:'bottom-right'
    })
  }
}

async function openAndSaveFolder() {
  const result = await window.electronAPI.openDirectoryDialog();
  console.log(result)
  if (result.canceled) return;
  // 保存结构到数据库
  const success=await window.electronAPI.dataOperation.saveDirectoryToDb(result.files,1);

  store.setChangedFolder(0)

  if (success){
    ElNotification.success({
      title:'成功',
      message:'文件已经导入成功',
      position:'bottom-right'
    })
  }else {
    ElNotification.error({
      title:'失败',
      message:'文件导入失败',
      position:'bottom-right'
    })
  }
}

</script>

<template>
<div class="dialog-fileAdd">
  <div class="fileAdd-title">
    <b>{{ props.title || "默认标题" }}</b>
  </div>
  <div class="fileAdd-menu">
    <div class="fileAdd-list">
      <div class="list-title">个人笔记</div>
      <div @click="openAndReadFile" class="list-add animate_button">导入文件</div>
      <div @click="openAndSaveFolder" class="list-add animate_button">导入文件夹</div>
    </div>
    <div class="fileAdd-list">
      <div class="list-title">文档管理</div>
      <div @click="" class="list-add">dianji</div>
      <div @click="" class="list-add">dianji</div>
      <div @click="" class="list-add">dianji</div>
      <div @click="" class="list-add">dianji</div>
    </div>
    <div class="fileAdd-list">
      <div class="list-title">其余操作</div>
    </div>
  </div>
</div>
</template>

<style scoped>
.dialog-fileAdd {
  height: 400px;
  display: flex;
  flex-direction: column;
  margin: 10px;
  gap: 5px;
  box-sizing: content-box;
}

.fileAdd-menu {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.fileAdd-list{
  width: 220px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.list-title {
  padding-left: 10px;
  margin-bottom: -4px;
  font-size: 13px;
  color: #888888;
}

.list-add{
  width: 100%;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>