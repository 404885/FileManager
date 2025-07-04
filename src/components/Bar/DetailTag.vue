<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "DetailTag",
  methods: {

  }
})
</script>

<template>
    <div class="window-detail" v-resizable="{ min: 180, max: 600 }">
      <input class="detail-filter"  placeholder="Filter keyword"/>
      dsadsad
    </div>
</template>

<style scoped>
.detail-filter {
  height: 30px;
  padding: 5px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}


</style>