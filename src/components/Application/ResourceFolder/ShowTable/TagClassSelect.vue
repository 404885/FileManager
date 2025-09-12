<script setup lang="ts">
import {ElDialog, ElTag, ElColorPicker, ElSelect, ElButton} from "element-plus";
import { ref, watch, onMounted } from "vue";
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
  if (!newVal) emit("close");
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
              <el-tag type="primary" class="select-option-preview-tagS">xxx</el-tag>
              <el-tag type="primary" class="select-option-preview-tagM">xxx</el-tag>
              <el-tag type="primary" class="select-option-preview-tagL">xxx</el-tag>
            </div>

          </div>

          <div class="select-option-background">
            <span class="select-option-item-text">颜色</span>
            <div class="select-option-background-color">
              <div class="select-option-background-color-picker">
                <el-color-picker show-alpha append-to="body"/>
                <span>背景颜色</span>
              </div>

              <div class="select-option-background-color-picker">
                <el-color-picker show-alpha append-to="body"/>
                <span>边框颜色</span>
              </div>

              <div class="select-option-background-color-picker">
                <el-color-picker show-alpha append-to="body"/>
                <span>文字颜色</span>
              </div>

            </div>
          </div>

          <div class="select-option-border">
            <span class="select-option-item-text">边框</span>
            <div class="select-option-border-select">
              <el-select  placeholder="Select" style="width: 240px" />
            </div>
          </div>
          <div class="select-option-radius">
            <span class="select-option-item-text">形状</span>
            <div class="select-option-radius-select">
              <div class="eee cycle selected"></div>
              <div class="eee round"></div>
              <div class="eee"></div>
            </div>
          </div>

        </div>

        <div class="select-method" v-show="page">
            test
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
  margin-top: 12px;
}
.select-option-preview-tag {
  display: flex;
  flex-direction: row;
  align-items: end;
  gap: 30px;
  justify-content: center;
}
.select-option-preview-tagL {
  width: 72px;
  height: 36px;
  font-size: 12px;
}
.select-option-preview-tagM {
  width: 64px;
  height: 32px;
}
.select-option-preview-tagS {
  width: 48px;
  height: 24px;
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

.select-option-radius-select {
  display: flex;
  flex-direction: row;
  gap: 30px;
  margin-top: 12px;
  margin-left: 24px;
}
.eee {
  width: 24px;
  height: 24px;
  background: rgb(176, 181, 184);  /* 偏白背景 */
  padding: 5px;
  border: 1px solid rgb(150, 150, 150); /* 设置与背景不同的颜色 */
}
.eee.selected {
  background: #707070;  /* 选中时背景色加深，更加明显 */
  border: 2px solid #404040; /* 加粗边框，并且颜色深一点 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* 增加更明显的阴影 */
  color: white;  /* 选中时将字体颜色改为白色，更突出 */
  font-weight: bold;  /* 加粗字体 */
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
