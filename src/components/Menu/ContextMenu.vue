<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, nextTick, watch, Ref} from 'vue'
import {ElTreeNode} from "@/utils/type.ts";
import {useTreeCondition} from "@/pinia/TreeCondition.ts";
import {openDialog,openDialogAsync} from "@/utils/component/Dialog.ts";


const emit = defineEmits(['close'])
const props = defineProps<{
  isLeaf: boolean,
  positionX: number
  positionY: number
  treeRef: Ref<any>
  currentWorkspace: Ref<number>
  data: ElTreeNode
}>()


//pinia初始化
const store = useTreeCondition()
// 创建弹窗容器
const container = ref<HTMLElement | null>(null)
// 最终计算出的显示位置
const computedX = ref(props.positionX)
const computedY = ref(props.positionY)




async function newFolder(){
  // const newNode = {
  //   label: '新建文件夹',
  //   isLeaf: false,
  //   type: 'folder',
  // }
  // openDialog({
  //   type: "editFile",
  //   props:{
  //     title: "新建文件夹",
  //   },
  // })


  const data = await openDialogAsync({
    type: 'editFile',
    props: { title: '新建文件夹' }
  })
  const name = data?.fileName?.trim() || '新建文件夹'
  const tableName = 'portfolio'
  const parentId = props.data.id
  const create_time = Date.now()
  const workspace = props.currentWorkspace.value
  const result = await window.electronAPI.dataOperation.execute(
      `INSERT INTO ${tableName} (name, connected_workspace, associated_folder, create_time) VALUES (?, ?, ?, ?)`,
      [name, workspace, parentId, create_time]
  )
  if (result){
    // 直接通过load()取数据库数据来实现刷新
    // props.treeRef.value.append(newNode, props.data)
    // 通过pinia设置更新状态
    store.setChangedFolder(props.data.id)
    return;
  }
}

async function renameFolder(){

}



// 调整弹窗位置
function adjustPosition() {
  if (!container.value) return
  const menuW = container.value.offsetWidth
  const menuH = container.value.offsetHeight
  const winW = window.innerWidth
  const winH = window.innerHeight
  const pad = 8
  let x = props.positionX ?? 0  // 使用默认值 0
  let y = props.positionY ?? 0  // 使用默认值 0
  if (x + menuW > winW - pad) {
    x = winW - menuW - pad
  }
  if (y + menuH > winH - pad) {
    y = winH - menuH - pad
  }
  computedX.value = Math.max(pad, x)
  computedY.value = Math.max(pad, y)
}
// 点击外部区域关闭弹窗
function handleClick(e: MouseEvent) {
  if (container.value && !container.value.contains(e.target as Node)) {
    emit('close')
  }
}
// 绑定弹窗
onMounted(async () => {
  await nextTick()
  adjustPosition()
  document.addEventListener('mousedown', handleClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClick)
})
// 监听位置变化后重新调整
watch(() => [props.positionX, props.positionY], async () => {
  await nextTick()
  adjustPosition()
})

</script>



<template>
    <div
        class="menu-context"
        :style="{ top: `${computedY}px`, left: `${computedX}px` }"
        ref="container">
      <!-- context-file.vue 文件菜单 -->
      <div class="context-file" v-show="props.isLeaf">
        <div class="context-item" @click="">打开</div>
        <div class="context-item" @click="">重命名</div>
        <div class="context-item" @click="">复制</div>
        <div class="context-item" @click="">剪切</div>
        <div class="context-item" @click="">移动</div>
        <div class="context-item" @click="">属性</div>
        <div class="context-item danger" @click="">删除</div>
      </div>
      <div class="context-folder" v-show="!props.isLeaf">
        <div class="context-item" @click="">新建文件</div>
        <div class="context-item" @click="newFolder">新建文件夹</div>
        <div class="context-item" @click="renameFolder">重命名</div>
        <div class="context-item">移动</div>
        <div class="context-item">属性</div>
        <div class="context-item danger">删除</div>
      </div>


    </div>
</template>

<style scoped>
.menu-context {
  position: absolute;
  width: 180px;
  padding: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);  /* 半透明白 */
  backdrop-filter: blur(20px);            /* 背景模糊 */
  -webkit-backdrop-filter: blur(12px);    /* 兼容 Safari */
  border: 1px solid rgba(255, 255, 255, 0.4); /* 半透明边框 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: #222;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  user-select: none;
  z-index: 1000;
  transition: box-shadow 0.3s ease;
}

.context-item {
  padding: 6px 6px 6px 10px;
  margin: 3px 0;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  color: #000000;
  background: transparent;
  transition: background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
  user-select: none;
}

.context-item.danger {
  color: #e74c3c;
}

.context-item:hover {
  background-color: #e6f0ff;
  color: #007aff;
}

.context-item.danger:hover {
  background-color: #fdecea;
  color: #d32f2f;
}


</style>