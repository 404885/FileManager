<script setup lang="ts">

const emit = defineEmits(['close'])

function closeDialog() {
  emit("close")
}
</script>

<template>
  <div class="dialog-overlay" @click.self='closeDialog()'>
    <div class="dialog-border fadeIn-slide">
      <div class="dialog-fileOpen">

      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-fileOpen {
  width: 300px;
  height: 100px;
  display: flex;
  flex-direction: column;
  margin: 10px;
  gap: 6px;
  box-sizing: content-box;
}
</style>