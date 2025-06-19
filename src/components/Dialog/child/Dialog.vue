<script setup lang="ts">
const props = defineProps({
  visible: Boolean,
  message: String,
})
</script>

<template>
  <teleport to="body">
    <div class="toast-warning" v-show="props.visible">
      <span class="icon">⚠️</span>
      <span class="message">{{ props.message }}</span>
    </div>

  </teleport>
</template>

<style scoped>
.toast-warning {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #ffe9cc;
  color: #8a3c00;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeInUp 1s ease;
  transition: opacity 1s ease;
}

.toast-warning .icon {
  font-size: 16px;
}

@keyframes fadeInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

</style>