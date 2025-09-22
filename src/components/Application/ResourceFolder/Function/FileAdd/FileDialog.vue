<script setup lang="ts">
import {ElDialog} from "element-plus";
import {ref, watch} from "vue";

const emit = defineEmits(['close'])
const props = defineProps<{
  id: string;
  dialogVisible: boolean;
}>()

const dialogVisible = ref<boolean>(props.dialogVisible);

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
      maxHeight: '700px',
      borderRadius: '16px'
    }">
      <template #default>
        <div class="fileAdd">
          <div class="fileAdd-left">
            <span class="fileAdd-title"><h2>添加资源</h2></span>
          </div>

          <div class="fileAdd-middle">
            <span class="fileAdd-title"><h3>待处理文件列表</h3></span>
            <p>这里是中间内容区</p>
            <p>（文件列表）</p>
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

.fileAdd-middle {
  flex: 1;
  padding: 25px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
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
  color: #333;
}
</style>