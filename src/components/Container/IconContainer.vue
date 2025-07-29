<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  fileType?: string     // 传入文件后缀名，如 pdf、doc、mp3
  size?: string         // 尺寸，如 '24px'
  customClass?: string  // 额外样式 class
}>()

const size = props.size || '20px'

const resolvedIcon = computed(() => {
  const type = props.fileType?.toLowerCase() || ''
  const map: Record<string, string> = {
    folder: 'folder',
    pdf: 'pdf',
    doc: 'word',
    docx: 'word',
    xls: 'excel',
    xlsx: 'excel',
    ppt: 'ppt',
    pptx: 'ppt',
    txt: 'txt',
    zip: 'zip',
    rar: 'zip',
    mp4: 'video',
    mov: 'video',
    mp3: 'audio',
    wav: 'audio',
    png: 'photo',
    jpg: 'photo',
    jpeg: 'photo',
    html: 'html',
    md: 'md',
  }
  return map[type] || map.default
})



</script>


<!-- src/components/SvgFileIcon.vue -->
<template>
  <svg class="svg-icon" :style="{ width: size, height: size }" :class="customClass" aria-hidden="true">
    <use :href="`#icon-${resolvedIcon}`" />
  </svg>
</template>

<style scoped>
.svg-icon {
  flex-shrink: 0;
  display: inline-block;
  fill: currentColor;
  vertical-align: middle;
  transition: color 0.2s, fill 0.2s;
  color: #424141; /* 默认图标颜色 */
  margin-right: 10px;
}
</style>
