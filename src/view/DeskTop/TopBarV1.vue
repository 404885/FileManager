<script setup lang="ts">
import { ref, onMounted } from 'vue';

const currentTime = ref('');

onMounted(() => {
  const updateTime = () => {
    const now = new Date();
    const options = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    currentTime.value = now.toLocaleDateString('en-US', options);
  };

  updateTime();
  setInterval(updateTime, 60000);
});
</script>

<template>
  <div class="menu-bar">
    <div class="left-section">
      <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Apple_logo_white.svg/1010px-Apple_logo_white.svg.png"
          alt="Apple Logo"
          class="apple-logo"
      />
      <span class="menu-item active">Finder</span>
      <span class="menu-item">文件</span>
      <span class="menu-item">编辑</span>
      <span class="menu-item">查看</span>
      <span class="menu-item">帮助</span>
    </div>

    <div class="right-section">
      <div class="icon-container">
        <i class="fas fa-wifi"></i>
      </div>
      <div class="icon-container">
        <i class="fas fa-battery-half"></i>
      </div>
      <div class="icon-container">
        <i class="fas fa-search"></i>
      </div>
      <div class="icon-container">
        <i class="fas fa-volume-up"></i>
      </div>
      <div class="time-display">{{ currentTime }}</div>
    </div>
  </div>
</template>

<style scoped>
.menu-bar {
  width: 100%;
  height: 28px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;

  background: rgba(255,255,255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);

  color: #fff;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  -webkit-app-region: drag;
}

.left-section,
.right-section {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 18px;
}

.apple-logo {
  height: 18px;
  filter: invert(1);
}

.menu-item {
  cursor: pointer;
  padding: 0 5px;
  line-height: 26px;
}

.menu-item.active {
  font-weight: bold;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.right-section i {
  color: #fff;
  font-size: 15px;
}

.time-display {
  line-height: 26px;
}
</style>