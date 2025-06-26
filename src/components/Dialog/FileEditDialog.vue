<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(['close', 'confirm'])
const props = defineProps<{
  title: string,
  choose: string,
}>()


const fileName = ref('')


function confirmDialog() {
  console.log("das")
  if (props.choose === 'edit') {
    emit("confirm", {'fileName': fileName.value})
    emit('close')
  }
  else if (props.choose === 'delete') {
    emit("confirm", {'delete': true})
    emit('close')
  }

}

function cancelDialog() {
  emit('close')
}

</script>

<template>
  <div class="dialog-overlay">
    <div class="dialog-border fadeIn-slide">
      <div class="dialog-fileEdit">
        <div class="fileEdit-title">
          <b>{{ props.title || "默认标题" }}</b>
        </div>
        <div class="fileEdit-edit" v-if="choose === 'edit' ">
          <div class="menu-tip">将{{}}命名为：</div>
          <input class="menu-input" type="text" v-model="fileName" placeholder="新建文件夹">
        </div>

        <div class="fileEdit-delete" v-if="choose === 'delete' ">
          <div class="menu-tip">确定要删除吗</div>
        </div>

        <div class="fileEdit-button">
          <button class="menu-button" @click="confirmDialog">确认</button>
          <button class="menu-button" @click="cancelDialog">取消</button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>



.dialog-fileEdit {
  width: 300px;
  height: 100px;
  display: flex;
  flex-direction: column;
  margin: 10px;
  gap: 6px;
  box-sizing: content-box;
}

.fileEdit-title{
  font-size: 14px !important;
}

.fileEdit-edit {
  display: flex;
  flex-direction: column;
}

.menu-tip {
  margin-left: 4px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #888888;
}

.menu-input {
  width: 300px;
  margin: auto;
}
.menu-button {
  font-size: 14px;
  width: 100px;
}

</style>