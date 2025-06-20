<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "DetailTag",
  methods: {

  }
})
</script>

<template>
  <div class="window-detail-wrapper" v-resizable="{ min: 180, max: 600 }">
    <div class="window-detail">
      dsadsad
    </div>
  </div>
</template>

<style scoped>
.window-detail-wrapper {
  display: flex;
  background: var(--menu-bg);
  border-right: 1px solid var(--menu-border);
  flex-direction: column;
  width: 180px;
}

.window-detail {

}
</style>