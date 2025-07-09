<script setup lang="ts">
import { ElNotification } from "element-plus";
import { useTreeCondition } from "@/pinia/TreeCondition.ts";

const emit = defineEmits(['close'])
const props = defineProps({
  title: { type: String },
})

function closeDialog() {
  emit("close")
}

const store = useTreeCondition()

async function openAndReadFile() {
  const result = await window.electronAPI.openFileDialog()
  if (result.canceled) return;
  // 保存结构到数据库
  const data ={
    name:result.name,
    path:result.path,
    size:result.stats.size,
    birthtime:result.stats.birthtime,
    atime:result.stats.atime,
  }
  const callback=await window.electronAPI.dataOperation.saveFileToDb(data,store.currentWorkspace);

  store.setChangedState(0)

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
  if (result.canceled) return;
  // 保存结构到数据库
  const success = await window.electronAPI.dataOperation.saveDirectoryToDb(result.files,store.currentWorkspace);

  store.setChangedState(0)

  if (success){
    ElNotification.success({
      title:'成功',
      message:'文件已经导入成功',
      position:'bottom-right'
    })
  }
  else {
    ElNotification.error({
      title:'失败',
      message:'文件导入失败',
      position:'bottom-right'
    })
  }
}


</script>

<template>
  <div class="dialog-overlay"  @click.self='closeDialog()'>
    <div class="dialog-border fadeIn-slide">
      <div class="dialog-add">
        <div class="add-title">
          <b>{{ props.title || "默认标题" }}</b>
        </div>
        <div class="add-menu">
          <div class="menu-list">
            <div class="list-title">个人笔记</div>
            <div @click="openAndReadFile" class="list-add animate_press">导入文件</div>
            <div @click="openAndSaveFolder" class="list-add animate_press">导入文件夹</div>
          </div>
          <div class="menu-list">
            <div class="list-title">文档管理</div>
            <div @click="" class="list-add">dianji</div>
            <div @click="" class="list-add">dianji</div>
            <div @click="" class="list-add">dianji</div>
            <div @click="" class="list-add">dianji</div>
          </div>
          <div class="menu-list">
            <div class="list-title">其余操作</div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<style scoped>

.dialog-add {
  height: 400px;
  display: flex;
  flex-direction: column;
  margin: 10px;
  gap: 5px;
  box-sizing: content-box;
}

.add-menu {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.menu-list{
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