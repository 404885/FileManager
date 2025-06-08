<!-- App.vue -->
<template>
  <div class="container">
    <!-- ① 侧边栏（默认隐藏）-->

    <!-- ② 主区域 -->
    <TabBar :tabs="tabs">
      <template #leftFiller>
        <el-icon><House /></el-icon>
      </template>
      <template #rightFiller>
        <el-icon><CloseBold /></el-icon>
      </template>
    </TabBar>
  </div>
</template>

<script setup lang="ts">
import {markRaw} from 'vue'
import {CloseBold, House, Search} from "@element-plus/icons-vue";
import TabBar from "@/components/TabBar.vue";
import Index from '@/view/index.vue';


const tabs=[
  {id:'home',title:'首页',icon:markRaw(Search),component:markRaw(Index)}
]


</script>

<style scoped>
.container {
  display: flex;
  height: 100%;
}

.side-container {
  width: 200px;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.top-bar{
  position: fixed;
  z-index: 1;
}

</style>

<!-- ------------- 下面是实现滑动动画的 CSS ------------- -->
<style scoped>
/*
  过渡类名对应 <transition name="slide-sidebar">：
  - slide-sidebar-enter-from: 进入时起始状态
  - slide-sidebar-enter-to:   进入时结束状态
  - slide-sidebar-enter-active: 进入动画的公共配置（duration）
  - slide-sidebar-leave-from:  离开时起始状态
  - slide-sidebar-leave-to:    离开时结束状态
  - slide-sidebar-leave-active: 离开动画的公共配置
*/

/* 初始隐藏状态：宽度从 0px 开始 */
.slide-sidebar-enter-from,
.slide-sidebar-leave-to {
  width: 0;
  opacity: 0;
}

/* 完全展开状态：宽度 200px （与 .side-container 一致）*/
.slide-sidebar-enter-to,
.slide-sidebar-leave-from {
  width: 200px;
  opacity: 1;
}

/* 过渡时长与 timing-function 可以自行调整 */
.slide-sidebar-enter-active,
.slide-sidebar-leave-active {
  transition: width 0.3s ease, opacity 0.3s ease;
}
</style>
