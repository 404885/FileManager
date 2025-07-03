<script setup lang="ts">
import {ref, onMounted } from 'vue'

const emit = defineEmits(['close'])

const workspaces = ref<any[]>([]);



function closeDialog() {
  emit("close")
}


async function load() {
  workspaces.value = await window.electronAPI.dataOperation.queryAll('SELECT * FROM workspace');
}

async function newWorkSpace(){
  const name = 'dasda'
  const create_time = Date.now()
  await window.electronAPI.dataOperation.execute(
      'INSERT INTO workspace (name, create_time) VALUES (?, ?)',
      [name, create_time])

  await load()
}

async function chooseWorkspace(index: number) {
  const Id = workspaces.value[index].id
  console.log(Id);

  await window.electronAPI.dataOperation.execute(
      `delete from workspace where id = ? `,
      [Id]
  )
  await load()
}



onMounted(async () => {
  await load()
});




</script>

<template>


    <div class="dialog-overlay" @click.self='closeDialog()'>
        <div class="dialog-switch">
          <div class="switch-title">
            <div class="btn animate_press" @click="newWorkSpace">新增</div>
            <div  class="btn">翻转</div>
          </div>
          <div class="switch-content">
            <div v-for="(item, index) in workspaces" :key="index" class="card fadeIn-slide" @click="chooseWorkspace(index)">
              <div class="card-title">{{ item }}</div>
              <hr class="card-hr">
              <div class="card-content">{{ item }}</div>
            </div>
          </div>

        </div>
    </div>
</template>

<style scoped>

.btn {
  width: 50px;
  height: 30px;
  background: white;
  border-radius: 6px;

  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: none;
  cursor: pointer;
  user-select: none;
  font-size: 14px;

  display: flex;
  align-items: center;    /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.switch-title {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 16px;
}

.switch-content {
  display: flex;
  align-items: center;    /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  flex: 1;
  gap: 20px;
  padding: 20px;
}


.card {
  width: 220px;
  height: 150px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 10px 16px;
  user-select: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}


.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.card-content {
  flex: 1;
  font-size: 14px;
  color: #555;
}

.card-hr {
  border: none;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.06); /* 极浅灰 */
  margin: 10px 0;
  border-radius: 1px;
}





</style>