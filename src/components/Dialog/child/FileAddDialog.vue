<script setup lang="ts">

const props = defineProps({
  title: { type: String },
})

async function openAndReadFile() {
  const result = await window.electronAPI.openFileDialog()
  if (!result.canceled) {
    const filePath:string = result.filePath ?? ''
    const fileContent:string = result.content ?? ''
    console.log(filePath, fileContent)
    // 你也可以绑定内容到页面上
  } else {
    alert('用户取消了选择')
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
      <div @click="" class="list-add animate_button">dianji</div>
      <div @click="" class="list-add animate_button">dianji</div>
      <div @click="" class="list-add animate_button">dianji</div>
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