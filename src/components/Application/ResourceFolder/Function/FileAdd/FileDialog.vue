<script setup lang="ts">
import {ElDialog, ElDivider} from "element-plus";
import {ref, watch, computed} from "vue";
import IconContainer from "@/components/Container/IconContainer.vue";

const emit = defineEmits(['close'])
const props = defineProps<{
  id: string;
  dialogVisible: boolean;
}>()

const dialogVisible = ref<boolean>(props.dialogVisible);

// 保持变量定义，并给一个初始值
const activeTab = ref<'add' | 'create'>('add');

// 核心代码：计算滑块位置
const sliderStyle = computed(() => {
  if (activeTab.value === 'add') {
    // 选中第一个按钮，滑块在起始位置
    return { transform: 'translateX(0%)' };
  } else {
    // 选中第二个按钮，滑块移动 100% (滑块本身宽度是 50%)
    return { transform: 'translateX(100%)' };
  }
});

watch(dialogVisible, async (newVal) => {
  if (!newVal) {
    emit("close")
  }
});
</script>

<template>
  <teleport to="body">
    <el-dialog v-model="dialogVisible" :show-close="false" align-center :style="{
      width: '90%',
      maxWidth: '1280px',
      height: '90vh',
      maxHeight: '800px',
      borderRadius: '16px'
    }">
      <template #default>
        <div class="fileAdd">
          <div class="fileAdd-left">
            <span class="fileAdd-title"><h2>添加资源</h2></span>
            <div class="fileAdd-left-tabs">
              <div class="fileAdd-left-tabs-slider" :style="sliderStyle"></div>
              <button
                  class="fileAdd-left-tabs-button"
                  :class="{ active: activeTab === 'add' }"
                  @click="activeTab = 'add'">添加文件</button>
              <button
                  class="fileAdd-left-tabs-button"
                  :class="{ active: activeTab === 'create' }"
                  @click="activeTab = 'create'">创建文件</button>
            </div>
            <div v-show="activeTab === 'add'" class="fileAdd-left-content">
              <div>
                <div class="fileAdd-left-content-text">拖入文件添加</div>
                <div class="fileAdd-left-content-upload">
                  <span class="fileAdd-left-content-upload-icon">📂</span>
                  <div class="fileAdd-left-content-upload-text">拖拽文件或点击选择</div>
                  <input type="file" class="fileAdd-left-content-upload-input" multiple>
                </div>
              </div>
              <div>
                <div class="fileAdd-left-content-text">通过网址添加</div>
                <div class="fileAdd-left-content-online">
                  <input type="text" class="fileAdd-left-content-online-input" placeholder="输入文件或资源链接">
                  <div class="fileAdd-left-content-online-buttons">
                    <button class="fileAdd-left-content-online-button btn-primary-grad">添加网址</button>
                    <button class="fileAdd-left-content-online-button btn-secondary-grad">抓取内容</button>
                  </div>
                </div>
              </div>
            </div>



            <div v-show="activeTab === 'create'" class="fileAdd-left-content">
              <p>这里是笔记和模板创作区域</p>
            </div>

          </div>

          <div class="fileAdd-middle">
            <span class="fileAdd-title"><h3>待处理文件列表</h3></span>
            <el-divider />
            <div class="fileAdd-middle-search">
              <input type="text" class="fileAdd-middle-search-input" placeholder="搜索文件...">
              <IconContainer size="18px" :link-mode="false" name="search" class="fileAdd-middle-search-icon"/>
            </div>
          </div>

          <div class="fileAdd-right">
            <span class="fileAdd-title"><h2>属性面板</h2></span>
            <p>这里是右侧面板</p>
            <p>（属性设置）</p>
          </div>
        </div>
      </template>
    </el-dialog>
  </teleport>
</template>

<style scoped>

.fileAdd {
  display: flex;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.fileAdd-left {
  background-color: #f8f9fb;
  border-right: #e8eaf0 solid 1px;
  width: 300px;
  padding: 25px;
  display: flex;
  flex-direction: column;
}
.fileAdd-left-tabs {
  display: flex;
  background-color: #e9edf2;
  border-radius: 6px;
  padding: 5px;
}
.fileAdd-left-tabs-button {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  border: none;
  color: #5f6c7b;
  background-color: transparent;
  font-weight: 600;

  z-index: 2; /* 确保按钮在滑块之上 */
  box-shadow: none;
}
.fileAdd-left-tabs-button.active {
  color: #4a72e2;
}
.fileAdd-left-tabs-slider {
  position: absolute;
  left: 5px;
  right: 5px;
  top: 5px; /* 匹配容器 padding */
  width: 48%; /* 关键：占据一半宽度 */
  height: calc(100% - 10px);
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 6px;
  z-index: 1;
  /* 核心：添加平滑过渡 */
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.fileAdd-left-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.fileAdd-left-content-text {
  font-weight: 600;
  color: #34495e;
  font-size: 15px;
  margin-top: 20px;
  margin-bottom: 16px;
}
.fileAdd-left-content-upload {
  /* 核心：虚线边框和圆角 */
  border: 2px dashed #d0d8e2;
  border-radius: 6px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
  position: relative;
  overflow: hidden;
}
.fileAdd-left-content-upload:hover {
  border-color: #4a72e2; /* 悬停时边框变色 */
  background-color: #f2f7ff; /* 悬停时背景变浅 */
}
.fileAdd-left-content-upload-icon {
  font-size: 36px;
  color: #a8b3c3;
  display: block;
}
.fileAdd-left-content-upload-text {
  color: #5f6c7b;
  margin-top: 15px;
  font-weight: 500;
  font-size: 16px;
}
/* 隐藏实际的文件输入框，让整个 upload-area 可点击 */
.fileAdd-left-content-upload-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
}
/* --- URL 输入区域样式 (新增) --- */
.fileAdd-left-content-online {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.fileAdd-left-content-online-input {
  width: 100%;
  padding: 12px 15px;
  border-radius: 6px;
  border: 2px solid #d0d8e2;
  box-sizing: border-box;
}
.fileAdd-left-content-online-input:focus {
  outline: none;
  border-color: #4c9aff; /* 强调色 */
  box-shadow: 0 0 0 3px rgba(76, 154, 255, 0.25); /* 聚焦光晕 */
}
/* --- 基础按钮样式 (所有按钮共享) --- */
.fileAdd-left-content-online-buttons {
  display: flex;
  gap: 12px;
  justify-content: start;
}
/* --- 2. 媒体查询 (大屏幕/竖向排列) --- */
@media (min-width: 962px) {
  .fileAdd-left-content-online-buttons {
    flex-direction: column;  /* 切换为竖直排列 */
    /* 更改 gap 适应垂直间距 */
    gap: 8px;
  }
}
.fileAdd-left-content-online-button {
  padding: 10px;

  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  transition: all 0.3s ease;
}
.fileAdd-left-content-online-button:active {
  transform: translateY(2px);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
}
.fileAdd-left-content-online-button.btn-secondary-grad {
  background-image: linear-gradient(135deg, #7093ff, #c29ffc);
}
.fileAdd-left-content-online-button.btn-primary-grad{

  background: linear-gradient(135deg, #7aa5ff, #6df4ff);
}
.fileAdd-left-content-online-button.btn-primary-grad:hover{
  background: linear-gradient(135deg, #6df4ff, #7aa5ff);
}
.fileAdd-left-content-online-button.btn-secondary-grad:hover {
  background-image: linear-gradient(135deg, #c29ffc, #7093ff);
}



.fileAdd-middle {
  flex: 1;
  padding: 25px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
/* 新增: 搜索容器，设置相对定位 */
.fileAdd-middle-search {
  position: relative;
  width: 100%;
}
/* 新增: 图标样式，设置绝对定位 */
.fileAdd-middle-search-icon {
  position: absolute;
  left: 8px; /* 图标距离左侧 8px */
  top: 50%; /* 垂直居中 */
  transform: translateY(-50%); /* 精确垂直居中 */
  color: #a0a4a9; /* 图标颜色 */
  font-size: 14px;
  pointer-events: none; /* 确保图标不阻挡鼠标事件 */
  z-index: 2;
}
.fileAdd-middle-search-input {
  width: 100%;
  padding: 6px 8px 6px 36px;
  border-radius: 4px;
  border: 1px solid #d0d8e2;
  /* 交互效果 */
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.fileAdd-middle-search-input:focus {
  outline: none;
  border-color: #4c9aff; /* 强调色 */
  box-shadow: 0 0 0 3px rgba(76, 154, 255, 0.25); /* 聚焦光晕 */
}




.fileAdd-right {
  width: 300px;
  background-color: #fcfdff;
  border-left: #e8eaf0 solid 1px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.fileAdd-title {
  margin-bottom: 10px;
  color: #333;
}
</style>