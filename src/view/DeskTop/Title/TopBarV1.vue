<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Clock from "@/view/DeskTop/Title/Function/Clock.vue";

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
  <div class="window-topbar" @click="console.log('dsa')">
    <div class="window-topbar-left">
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
    <div class="window-topbar-middle"></div>
    <div class="window-topbar-right">
      <div class="time-display">{{ currentTime }}</div>
      <Clock></Clock>
    </div>
  </div>
</template>

<style scoped>
.window-topbar {
  width: 100%;
  height: 28px;

  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 15px;

  background: rgba(255,255,255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);

  color: #fff;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  user-select: none;
}

.window-topbar-left,
.window-topbar-right {
  display: flex;
  align-items: center;
  width: fit-content;
  height: 100%;
  gap: 18px;
}
.window-topbar-middle {
  flex: 1;
  height: 100%;
  -webkit-app-region: drag;
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


.window-topbar-right-section i {
  color: #fff;
  font-size: 15px;
}

.time-display {
  line-height: 26px;
}
</style>