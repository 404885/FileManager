<script lang="ts" setup>

import {ref} from "vue";
import FileDesk from "@/components/Desktop/FileDesk.vue";

const icons = [
  { name: '我的电脑', icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f5a5.svg' },
  { name: '回收站', icon: 'https://cdn-icons-png.flaticon.com/512/484/484662.png' },
  { name: '文档', icon: 'https://cdn-icons-png.flaticon.com/512/337/337946.png' },
  { name: '控制面板', icon: 'https://cdn-icons-png.flaticon.com/512/3524/3524659.png' },
  { name: '浏览器', icon: 'https://cdn-icons-png.flaticon.com/512/888/888879.png' },
]


const isShow = ref(false);

function aa(){
  isShow.value = !isShow.value;
}

</script>

<template>
<div class="window-home">
  <div class="desktop-icons">
    <div class="desktop-icon" v-for="item in icons" :key="item.name" @click="aa">
      <img :src="item.icon" class="icon-img" />
      <div class="icon-label">{{ item.name }}</div>
    </div>

    <div class="test">
      <FileDesk v-if="isShow"></FileDesk>
    </div>
  </div>


</div>
</template>




<style scoped>

.window-home {
  display: flex;
  background: white;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, #a1c4fd, #c2e9fb);
  overflow: hidden;

  border-radius: 6px;
  padding: 12px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06); /* 内容区也给一点阴影和圆角 */
}

.desktop-icon {
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: white;
  cursor: pointer;
  user-select: none;

  border-radius: 10px;
  transition: background 0.2s;
}

.desktop-icon:hover {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(2px);
}

.icon-img {
  width: 24px;
  height: 24px;
  margin-bottom: 6px;
}

.icon-label {
  font-size: 12px;
  text-align: center;
  line-height: 1.2;
}




</style>