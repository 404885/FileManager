<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "MainView",
  data(){
    return{
      filePath: '',
      fileContent: '',
    }
  },
  methods: {
    async openAndReadFile(){
      const result = await window.electronAPI.openFileDialog()
      if (!result.canceled) {
        this.filePath = result.filePath ?? ''
        this.fileContent = result.content ?? ''
        // 你也可以绑定内容到页面上
      } else {
        alert('用户取消了选择')
      }
    }
  }
})
</script>

<template>
  {{ filePath }}
  {{ fileContent }}
  <button @click="openAndReadFile">打开并读取文件</button>
</template>

<style scoped>

</style>