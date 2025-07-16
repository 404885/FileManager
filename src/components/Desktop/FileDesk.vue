<script setup lang="ts">
import DetailSpace from "@/components/Bar/DetailSpace.vue";
import IndexView from "@/view/IndexView.vue";
</script>

<template>
  <div class="aa fadeIn-slide">
    <DetailSpace></DetailSpace>
    <IndexView></IndexView>
  </div>
</template>

<style scoped>
.aa {
  display: flex;
  flex-direction: row;
  background: white;
  width: 50%;  /* 宽度占父元素的80% */
  height: 50%; /* 高度占父元素的80% */
  margin: 10px;
  gap: 6px;
  box-sizing: content-box;
  z-index: 100000;

  position: absolute;
  top: 30%;
  left: 30%;

  animation: fadeInSlide 0.5s ease-in-out forwards;
}

::v-deep(.detail-section),
::v-deep(.detail-describe),
::v-deep(.detail-filter) {
  display: none;
}

::v-deep(.window-table){
  width: 100%;
  height: 100%;
}

</style>
