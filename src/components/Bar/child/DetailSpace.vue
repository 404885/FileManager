<script setup lang="ts">
import {ref, watch} from 'vue'
import {TreeInstance} from "element-plus";


interface Tree {
  [key: string]: any
}

const filterText = ref('')
const treeRef = ref<TreeInstance>()

const defaultProps = {
  children: 'children',
  label: 'label',
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}

const data: Tree[] = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1',
      },
      {
        id: 8,
        label: 'Level two 3-2',
      },
    ],
  },
]
</script>

<template>
  <div class="window-detail-wrapper" v-resizable="{ min: 20, max: 600 }" >
    <div class="window-detail">
      <input
          class="file-tree-filter"
          v-model="filterText"
          placeholder="Filter keyword"
      />
      <el-tree
          ref="treeRef"
          class="file-tree"
          :data="data"
          :props="defaultProps"
          default-expand-all
          draggable
          highlight-current
          :filter-node-method="filterNode"
      />
    </div>
    <div class="window-detail" >

    </div>
  </div>
</template>

<style scoped>

.window-detail-wrapper {
  display: flex;
  height: 100%;
  background: #f9fbfd;
  border-right: 1px solid #d9e2ec;
  overflow: hidden;
  flex-direction: column;
}

.window-detail {
  flex: 1;
  padding: 5px;
  user-select: none;
}

.file-tree-filter{
  height: 10px;
  margin-bottom: 10px;
}
.file-tree{
  background: #f9fbfd;
}
</style>