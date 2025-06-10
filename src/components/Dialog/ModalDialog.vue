<script setup lang="ts">

const emit = defineEmits(['close'])

function closeDialog() {
  emit("close")

}


</script>

<template>
    <div class="dialog-overlay"  @click.self='closeDialog()'>
      <div class="dialog-content animate__animated animate__fadeIn">
        <slot/>
      </div>
    </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.dialog-content {
  background: white;
  border-radius: 10px;
  min-width: 300px;
  max-width: 80%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}


</style>
