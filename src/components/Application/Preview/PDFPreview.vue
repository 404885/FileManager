<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'

const pdfRef = ref<InstanceType<typeof VuePdfEmbed> | null>(null)
const source = ref<ArrayBuffer | null>(null)
const page = ref(1)
const pageCount = ref(0)
const scale = ref(1)

onMounted(async () => {
  const url = 'F:\\WebStormProject\\FileManager\\public\\testFile\\2024詹勇_毕业设计说明书（论文） - 副本.pdf'
  window.electronAPI.openFileByPath(url).then(result =>{
    if (result.success){
      source.value = new Uint8Array(result.buffer).buffer

    }else {
      console.error(result.error)
    }
  })
})

function onLoaded(pdf: any) {
  pageCount.value = pdf.numPages
}
function prevPage() { if(page.value>1) page.value-- }
function nextPage() { if(page.value<pageCount.value) page.value++ }
function zoomIn() { scale.value += 0.1 }
function zoomOut() { if(scale.value>0.2) scale.value -= 0.1 }
</script>

<template>
  <div>
    <div class="toolbar">
      <button @click="prevPage" :disabled="page===1">上一页</button>
      <span>{{ page }} / {{ pageCount }}</span>
      <button @click="nextPage" :disabled="page===pageCount">下一页</button>
      <button @click="zoomOut">缩小</button>
      <button @click="zoomIn">放大</button>
    </div>

    <vue-pdf-embed
        v-if="source"
        ref="pdfRef"
        :source="source"
        :page="page"
        :scale="scale"
        class="pdf"
        annotation-layer
        text-layer
        @loaded="onLoaded"
    />
  </div>
</template>

<style scoped>
  .pdf{
    width: 100%;
    height: 100vh;
    overflow: auto;
  }
</style>
