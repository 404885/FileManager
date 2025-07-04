<script setup lang="ts">
import {ref, onMounted } from 'vue'


const emit = defineEmits(['close'])

const workspaces = ref<any[]>([]);
const currentIndex = ref<number>(0)


// const scrollDelta = ref<number>(0)
// let timer: ReturnType<typeof setTimeout> | null = null





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


// 取模并确保首尾循环
function mod(n:number, m:number) {
  return (n + m) % m;
}

// 取模重设置
function set(i: number) {
  currentIndex.value = mod(i, workspaces.value.length);
}
// 通过dot设置当前活跃页
function setCurrent(i: number) {
  currentIndex.value = i
}
// 处理点击不同卡片的点击事件，并设置工作空间
function setWorkSpace(id: number, index: number) {
  const total = workspaces.value.length
  const current = currentIndex.value

  if (index === mod(current - 1, total)) {
    set(current + 1)  // 从左滑到中间
  } else if (index === mod(current + 1, total)) {
    set(current - 1)  // 从右滑到中间
  } else if (index === current) {
    // 如果是中间，触发默认逻辑
    console.log(`选择工作区${id}为当前工作区`)
  }
  set(index)
  console.log(id)
}



// 获取卡片样式
const getCardClass = (index: number) => {
  const total = workspaces.value.length;
  const current = currentIndex.value;
  // 当前卡片，居中
  if (index === current) return 'card center'
  // 前一张卡片（向左滑动）
  else if (index === mod(current - 1, total)) return 'card left anim-left-out'
  // 后一张卡片（向右滑动）
  else if (index === mod(current + 1, total)) return 'card right anim-right-in'
  // 其他卡片，隐藏
  else return 'card hidden';
};
// 获取dot样式
const getDotClass = (index: number) => {
  const current = currentIndex.value;
  if (index === current) return 'active'
}





onMounted(async () => {
  await load()
});




</script>

<template>


    <div class="dialog-overlay" @click.self='closeDialog()'>
        <div class="dialog-switch">

          <div class="switch-title">
            <div class="plain-btn animate_press" @click="newWorkSpace">新增</div>
            <div class="plain-btn" @click="set(currentIndex - 1)">←</div>
            <div class="plain-btn" @click="set(currentIndex + 1)">→</div>
          </div>

          <div class="switch-content">

            <div class="content-card">
              <div v-for="(item, index) in workspaces" :key="index" @click="setWorkSpace(item.id, index)" :class="getCardClass(index)">
                <div class="card-title">{{ item.id }}</div>
                <hr class="card-hr">
                <div class="card-content">{{ item }}</div>
              </div>
            </div>

            <div class="content-dot">
              <div v-for="(_item, index) in workspaces" class="dot" @click="setCurrent(index)" :class="getDotClass(index)">
              </div>
            </div>
          </div>

        </div>
    </div>
</template>

<style scoped>

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
  flex-direction: column;
}

.content-dot {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 6px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #e0e0e0;       /* 更柔和的默认颜色 */
  transition: background-color 0.3s, transform 0.3s; /* 平滑动画 */
}
.dot.active {
  background-color: #409EFF; /* 主题蓝 */
}

.content-card {
  width: 700px;
  height: 300px;
  position: relative;
  perspective: 1000px;
}
/* 卡片的基础样式 */
.card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 320px;
  height: 220px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.5s, opacity 0.5s;
  opacity: 0;
  pointer-events: none;
}
/* 当前卡片样式（居中） */
.card.center {
  transform: translate(-50%, -50%) translateZ(80px) scale(1.1);  /* 居中卡片，稍微放大 */
  opacity: 1;
  pointer-events: auto;
  z-index: 2;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);  /* 增加阴影，使卡片浮动感更强 */
}
/* 左侧卡片样式 */
.card.left {
  transform: translate(-150%, -50%) scale(0.85) rotateY(30deg);  /* 增加旋转角度，产生更强的倾斜效果 */
  opacity: 0.8;
  pointer-events: auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);  /* 轻微阴影 */
}
/* 右侧卡片样式 */
.card.right {
  transform: translate(50%, -50%) scale(0.85) rotateY(-30deg);  /* 增加旋转角度，产生更强的倾斜效果 */
  opacity: 0.8;
  pointer-events: auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);  /* 轻微阴影 */
}
/* 隐藏卡片样式 */
.card.hidden {
  transform: translate(-50%, -50%) scale(0.7);  /* 更小的缩放，给人远离的感觉 */
  opacity: 0;
  pointer-events: none;
  z-index: 0;
  box-shadow: none;  /* 隐藏卡片不需要阴影 */
}

.card-title {
  font-size: 14px;
  font-weight: 600;
}
.card-content {
  flex: 1;
  margin: 20px;
  font-size: 14px;
}
.card-hr {
  border: none;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.06); /* 极浅灰 */
  margin: 10px 0;
  border-radius: 1px;
}

</style>