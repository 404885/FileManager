<script setup lang="ts">
import { ElDialog } from "element-plus";
import { ref, watch, onMounted } from "vue";

const emit = defineEmits(['close']);
const props = defineProps<{
  dialogVisible: boolean;
  rect: DOMRect;
}>();

const dialogVisible = ref(props.dialogVisible);
const { top, right, left, height, width } = props.rect;

const fixedHeight = 300; // 固定高度
const fixedWidth = 400;  // 固定宽度
const windowHeight = ref(window.innerHeight)
const windowWidth = ref(window.innerWidth);

const dialogPosition = ref<{ top: string; left: string }>({
  top: '0px',
  left: '0px'
});

const positionCompute = () => {

}

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
      posTop = top + height
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
      ddsadsadas
    </el-dialog>
  </teleport>
</template>
