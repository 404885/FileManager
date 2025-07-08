<template>
  <div>
    <h3>我是子路径视图</h3>
    <p>路径参数：{{ route.params.catchAll }}</p>
    {{ route.fullPath }}
  </div>
</template>



<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
