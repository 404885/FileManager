<script setup>

const emit = defineEmits(['close'])

function closeDialog() {
  emit("close")
}

const workspaces = [
  { name: '工作区 A', desc: '📂 项目 / 文件' },
  { name: '工作区 B', desc: '📁 Markdown 文档' },
  { name: '工作区 C', desc: '📝 草稿 / 快捷记录' },
]
</script>

<template>
    <div class="dialog-overlay" @click.self='closeDialog()'>
      <div class="fadeIn-slide">
        <div class="card-container">


          <div v-for="(item, index) in workspaces" :key="index" class="card">
            <div class="card-title">{{ item.name }}</div>
            <hr class="test">
            <div class="card-content">{{ item.desc }}</div>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>

.card-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  justify-content: center;
}
.card {
  width: 220px;
  height: 150px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 10px 16px;
  user-select: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.card-content {
  flex: 1;
  font-size: 14px;
  color: #555;
}

.test {
  border: none;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.06); /* 极浅灰 */
  margin: 10px 0;
  border-radius: 1px;
}

</style>