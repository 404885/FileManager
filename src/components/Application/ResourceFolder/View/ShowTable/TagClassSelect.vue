<script setup lang="ts">
import {ElDialog, ElTag, ElColorPicker, ElSelect, ElButton, ElOption, ElDivider, ElSlider} from "element-plus";
import { ref, watch, onMounted, computed } from "vue";
import IconContainer from "@/components/Container/IconContainer.vue";

const emit = defineEmits(['close']);
const props = defineProps<{
  dialogVisible: boolean;
  rect: DOMRect;
}>();

const dialogVisible = ref(props.dialogVisible);
const { top, left, height, width } = props.rect;

const fixedHeight = 400; // 固定高度
const fixedWidth = 300;  // 固定宽度
const windowHeight = ref(window.innerHeight)
const windowWidth = ref(window.innerWidth);
const dialogPosition = ref<{ top: string; left: string }>({
  top: '0px',
  left: '0px'
});
const page = ref(false);
const radius = ref('');
const border = ref('')
const borderWidth = ref(0)
const backColor = ref('')
const textColor = ref('')
const borderColor = ref('')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])


const tagStyle = computed(() => {
  const style: Record<string, string> = {}
  // 背景色 & 文字色
  if (backColor.value) style.backgroundColor = backColor.value
  if (textColor.value) style.color = textColor.value
  // 边框处理
  if (border.value === "none") {
    style.border = "none"
  }
  else {
    const width = borderWidth.value > 0 ? `${borderWidth.value}px` : "1px"
    const type = border.value
    const color = borderColor.value

    style.border = `${width} ${type} ${color}`
  }
  // 圆角处理
  switch (radius.value) {
    case "cycle":
      style.borderRadius = "50%"
      break
    case "round":
      style.borderRadius = "4px"
      break
    default:
      style.borderRadius = "0px"
  }
  return style
})


onMounted(() => {
  // 默认右侧布局
  let posLeft = left + width + 20;
  let posTop = top;

  // 判断是否使用上下布局
  if (left + fixedWidth + width > windowWidth.value) {
    // 判断靠左或是靠右
    if (left + fixedWidth > windowWidth.value) {
      posLeft = left - fixedWidth + width;
    }
    else {
      posLeft = left;
    }
    // 判断上下布局靠上还是靠下
    if (top + fixedHeight + height > windowHeight.value) {
      posTop = top - fixedHeight - 4;
    }
    else {
      posTop = top + height + 4
    }

  }
  else {
    // 判断上下布局靠上还是靠下
    if (top + fixedHeight + height > windowHeight.value) {
      posTop = top - fixedHeight + height;
    }
    else {
      posTop = top
    }
  }

  dialogPosition.value = {
    top: `${posTop}px`,
    left: `${posLeft}px`
  };
});

watch(dialogVisible, (newVal) => {
  if (!newVal) emit("close", 'das');
});


</script>

<template>
  <teleport to="body">
    <el-dialog
        v-model="dialogVisible"
        :modal="false"
        :style="{
        position: 'fixed',
        top: dialogPosition.top,
        left: dialogPosition.left,
        zIndex: 9999,
        height: `${fixedHeight}px`,
        width: `${fixedWidth}px`
      }">
      <div class="select">
        <div class="select-option" v-show="!page">

          <div class="select-option-preview">
            <span class="select-option-item-text">预览</span>
            <div class="select-option-preview-tag">
              <el-tag type="primary" class="select-option-preview-tagS" :style="tagStyle">这是</el-tag>
              <el-tag type="primary" class="select-option-preview-tagM" :style="tagStyle">tag</el-tag>
              <el-tag type="primary" class="select-option-preview-tagL" :style="tagStyle">预览</el-tag>
            </div>

          </div>

          <div class="select-option-background">
            <span class="select-option-item-text">颜色</span>
            <div class="select-option-background-color">

              <div class="select-option-background-color-picker">
                <el-color-picker show-alpha append-to="body" v-model="backColor" :predefine="predefineColors"/>
                <span>背景颜色</span>
              </div>

              <div class="select-option-background-color-picker">
                <el-color-picker show-alpha append-to="body" v-model="borderColor" :predefine="predefineColors"/>
                <span>边框颜色</span>
              </div>

              <div class="select-option-background-color-picker">
                <el-color-picker show-alpha append-to="body" v-model="textColor" :predefine="predefineColors"/>
                <span>文字颜色</span>
              </div>

            </div>
          </div>

          <div class="select-option-border">
            <span class="select-option-item-text">边框</span>

            <div class="select-option-border-select">
              <el-select  placeholder="Select" style="width: 240px" v-model="border" append-to="body">
                <el-option label="实线" value="solid" class="select-option-border-select-option">
                  <el-divider style="border: 1px solid #333; "></el-divider>
                </el-option>
                <el-option label="虚线" value="dashed" class="select-option-border-select-option">
                  <el-divider style="border: 1px dashed #333;"></el-divider>
                </el-option>
                <el-option label="无边框" value="none" class="select-option-border-select-option">
                  hidden
                </el-option>
              </el-select>
            </div>
            <div class="select-option-border-slider">
              <el-slider v-model="borderWidth" size="small" style="width: 240px" :min="0" :max="5"/>
            </div>
          </div>

          <div class="select-option-radius">
            <span class="select-option-item-text">形状</span>
            <div class="select-option-radius-select">
              <div class="eee cycle  animate_press" @click="radius = 'cycle' " :class="{'selected': radius === 'cycle'}"></div>
              <div class="eee round animate_press" @click="radius = 'round' " :class="{'selected': radius === 'round'}"></div>
              <div class="eee animate_press" @click="radius = 'rect' " :class="{'selected': radius === 'rect'}"></div>
            </div>
          </div>
        </div>

        <div class="select-method" v-show="page">
          <div class="select-option-schedule">
            <span class="select-option-item-text">预设方案</span>
            <div class="select-option-schedule-select">

            </div>
          </div>
        </div>

        <div class="select-arrow" @click="page = false" v-show="page">
          <IconContainer :link-mode="false" name="arrowUp"/>
        </div>
        <div class="select-arrow" @click="page = true" v-show="!page">
          <IconContainer :link-mode="false" name="arrowDown"/>
        </div>

        <div class="select-button">
          <el-button type="success">确认</el-button>
          <el-button type="primary">save</el-button>
          <el-button type="danger">取消</el-button>
        </div>

      </div>
    </el-dialog>
  </teleport>
</template>

<style scoped>
.select {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 10px;
}
.select-option {
  display: flex;
  flex-direction: column;
  gap: 16px;
}



.select-option-item-text {
  color: #333;
  font-weight: 550;

}

.select-option-preview {
  display: flex;
  flex-direction: column;
}
.select-option-preview-tag {
  display: flex;
  flex-direction: row;
  align-items: end;
  gap: 30px;
  justify-content: center;
}
/* S = 基准 */
.select-option-preview-tagS {
  width: 48px;
  height: 24px;
  font-size: 12px;
  line-height: 24px;   /* = height，保证垂直居中 */
  text-align: center;  /* 水平居中 */
}
/* M = 1.25 倍 */
.select-option-preview-tagM {
  width: 60px;
  height: 30px;
  font-size: 15px;
  line-height: 30px;   /* 保持和高度一致 */
  text-align: center;
}
/* L = 1.5 倍 */
.select-option-preview-tagL {
  width: 72px;
  height: 36px;
  font-size: 18px;
  line-height: 36px;
  text-align: center;
}


.select-option-background-color{
  margin-top: 12px;
  display: flex;
  flex-direction: row;
  gap: 40px;
  justify-content: center;
}
.select-option-background-color-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
}



.select-option-border-select {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 12px;
}
.select-option-border-select-option {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.select-option-border-slider {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4px;
}
.select-option-radius {
  margin-top: -6px;
}
.select-option-radius-select {
  display: flex;
  flex-direction: row;
  gap: 30px;
  margin-top: 12px;
  margin-left: 24px;
}

/* 基本样式 */
.eee {
  width: 24px;
  height: 24px;
  background: #d1e7ff;  /* 默认背景色，淡蓝色 */
  padding: 5px;
  border: 1px solid #8bb9ff; /* 边框颜色，浅蓝色 */
  cursor: pointer;  /* 添加点击效果 */
  transition: all 0.3s ease;  /* 平滑过渡效果 */
}
/* 选中状态样式 */
.eee.selected {
  background: #4a90e2;  /* 选中时背景色，明亮的蓝色 */
  border-color: #2a70b5; /* 选中时边框颜色，深蓝色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 增加轻微阴影效果 */
  color: white;  /* 选中时字体颜色 */
  font-weight: bold;  /* 字体加粗 */
}
.cycle {
  border-radius: 50%;
}
.round {
  border-radius: 5px;
}




.select-button {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: end;
}

.select-arrow {
  display: flex;
  position: absolute;
  bottom: 14px;
  left: 14px;
  height: 24px;
  width: 24px;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}




</style>
