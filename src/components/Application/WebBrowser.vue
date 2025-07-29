<script setup lang="ts">

import ViewContainer from "@/components/Container/ViewContainer.vue";
import {ref} from "vue";
import IconContainer from "@/components/Container/IconContainer.vue";

const props = defineProps<{
  title: string,
}>()

const show = ref(true)


</script>

<template>
  <teleport to="#app" v-if="show">
    <ViewContainer :title="props.title" @close="show = false">
      <template #title-slot>
        <div class="icons">
          <IconContainer size="18px" :link-mode="false" name="back" class="non-drag" @click="console.log('das')"/>
          <IconContainer size="18px" :link-mode="false" name="refresh" class="non-drag" @click="console.log('das')"/>
          <IconContainer size="18px" :link-mode="false" name="menu" class="non-drag" @click="console.log('das')"/>
        </div>
        <div class="ttt">
          <div class="input-wrap">
            <input class="title-input"/>
          </div>
        </div>
        <div class="icons-2">
          <IconContainer size="20px" :link-mode="false" name="like" class="non-drag" @click="console.log('das')"/>
          <IconContainer size="20px" :link-mode="false" name="history" class="non-drag" @click="console.log('das')"/>
          <IconContainer size="20px" :link-mode="false" name="cut" class="non-drag" @click="console.log('das')"/>
          <IconContainer size="20px" :link-mode="false" name="user" class="non-drag" @click="console.log('das')"/>
        </div>
      </template>

      <div class="browser">
        <webview src="https://www.bing.com" style="width:100%; height:100%;"/>
      </div>
    </ViewContainer>
  </teleport>
</template>

<style scoped>
:deep(.title){
  display: none;
}

.browser{
  width: 100%;
  height: 100%;
}

.icons {
  margin-left: 24px;
  margin-right: 24px;
  display: flex;
  gap: 16px;
}
.icons-2 {
  display: flex;
  gap: 16px;
}

.ttt {
  font-size: 14px;
  display: flex;
  flex: 1;
  justify-content: space-between;
}

input.title-input {
  /* 移除浏览器默认样式 */
  -webkit-appearance: none;
  border: none;

  /* 简洁的 macOS 背景和圆角 */
  background-color: rgba(255, 255, 255, 0.4); /* 更浅的半透明背景 */
  border-radius: 6px; /* 略小的圆角 */

  /* 降低高度并调整内边距 */
  height: 24px; /* 降低高度 */
  width: 240px; /* 保持宽度 */
  padding: 6px 10px 6px 30px; /* 对应调整内边距 */

  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.05); /* 外部细微阴影 */
  /* 添加过渡效果，让焦点变化更平滑 */
  transition: all 0.2s ease-in-out;

  background-image: url('@/assets/icons/search.svg'); /* 可替换为 base64 */
  background-repeat: no-repeat;
  background-size: 16px 16px;
  background-position: 10px center;
}




</style>