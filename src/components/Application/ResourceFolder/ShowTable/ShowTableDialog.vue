
<script lang="ts" setup>
import { ref } from 'vue'
import { ElDialog, ElButton, ElInputTag } from 'element-plus'

const emit = defineEmits(['close'])

const props = defineProps<{
  dialogVisible: boolean
  cellId: string
  type: string
}>()



const dialogVisible = ref(props.dialogVisible)
const input = ref<string[]>()


async function close(){
  dialogVisible.value = false
  emit('close')



  const sql = `
  UPDATE ${props.type === 'folder' ? 'portfolio' : 'file'}
  SET tag = ?, last_browse_time = ?
  WHERE id = ?
`;

  const params = [
    String(input.value), // 确保 newTag 是字符串
    Date.now(),            // last_browse_time 是数字
    Number(props.cellId),      // 确保 id 是数字
  ];

  const res = await window.electronAPI.dataOperation.execute(sql, params);

  if (res.changes === 1) {
    console.log(`${props.type} tag 修改成功`);
  } else {
    console.log(`${props.type} tag 修改失败或未改变`);
  }



}

</script>


<template>
<teleport to="body">
  <el-dialog v-model="dialogVisible" title="输入tag" width="500" align-center>
      xxx
  </el-dialog>
</teleport>

</template>

