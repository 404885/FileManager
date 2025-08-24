<template>
  <div class="pdf-viewer">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import {getDocument,GlobalWorkerOptions} from 'pdfjs-dist'
import PDFWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import {onBeforeUnmount, onMounted, ref} from "vue";

GlobalWorkerOptions.workerSrc = PDFWorker

const url = 'F:\\WebStormProject\\FileManager\\public\\testFile\\2024詹勇_毕业设计说明书（论文） - 副本.pdf'

const canvas = ref<HTMLCanvasElement | null>(null)
let loadingTask: any = null

async function renderFirstPageFromUrl(buffer:Uint8Array) {
  loadingTask = getDocument(buffer)
  console.log(buffer)
  const pdf = await loadingTask.promise
  const page = await pdf.getPage(1)
  const viewport = page.getViewport({ scale: 1.5 })
  const c = canvas.value!
  c.width = Math.floor(viewport.width)
  c.height = Math.floor(viewport.height)
  const ctx = c.getContext('2d')!
  await page.render({ canvasContext: ctx, viewport }).promise
}

onMounted(async () => {
  const result = await window.electronAPI.openFileByPath(url)

  renderFirstPageFromUrl(result.buffer!).catch(console.error)
})

onBeforeUnmount(() => {
  if (loadingTask && loadingTask.destroy) loadingTask.destroy()
})
</script>

<style scoped>
.pdf-viewer canvas {
  width: 100%;
  height: auto;
  display:block;
}
</style>
