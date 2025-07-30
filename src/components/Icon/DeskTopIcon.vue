<script setup lang="ts">

defineProps({
  icon: {
    required:true,
    type:String,
  },
  name:{
    required:true,
    type:String,
  }
})
</script>

<template>
  <div class="desktop-icon-wrapper">
    <svg class="desktop-icon" aria-hidden="true">
      <use :href="'#icon-'+icon" />
    </svg>
    <span class="desktop-icon-name">{{name}}</span>
  </div>
</template>

<style scoped>
.desktop-icon-wrapper {
  display: flex;
  flex-direction: column; /* 图标和文字垂直排列 */
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  width: 80px; /* 图标区域的宽度 */
  height: 80px; /* 图标区域的高度 */
  cursor: default; /* 鼠标悬停时显示手型光标 */
  border: 1px solid transparent; /* 默认透明边框，避免hover时布局跳动 */
  border-radius: 5px; /* 轻微圆角 */
  user-select: none;

  /* 添加平滑过渡效果 */
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.desktop-icon-wrapper:hover{
  background-color: rgba(255, 255, 255, 0.22); /* 鼠标悬停时背景变浅半透明 */
  border-color: rgba(255, 255, 255, 0.5); /* 边框变亮 */
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3); /* 添加一点点阴影 */
}

.desktop-icon{
  width: 4em;
  height: 4em;
}
.desktop-icon-name{
  text-align: center;
  font-size: 0.7em;
  color: white;
  font-family: "Microsoft YaHei",serif;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.79);
  padding-bottom: 5px;
}

</style>