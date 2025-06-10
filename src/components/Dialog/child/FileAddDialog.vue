<script setup lang="ts">

const props = defineProps({
  title: { type: String },
})

</script>

<template>
<div class="dialog-fileAdd">
  <div class="fileAdd-title">
    <b>{{ props.title || "默认标题" }}</b>
  </div>
  <div class="fileAdd-list">
    <div class="AddList list-note">
      笔记管理
    </div>
    <div class="AddList list-file">
      本地文档管理
    </div>
    <div class="AddList list-other">
      其余文件
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

.fileAdd-list {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.AddList{
  width: 220px;
  border-radius: 6px;
}

.list-note {
  background: #a0b5d7;
}

.list-file {
  background: #9aa8c9;
}

.list-other {
  background: #b39ddb;
}
</style>