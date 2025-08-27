<script setup lang="ts">
import { ref } from 'vue';
import ViewContainerV2 from "@/components/Container/ViewContainerV2.vue";

const emit = defineEmits(['close'])
const props = defineProps<{
  id:string,
  icon:string,
  title: string,
}>()

const YOUR_DEPLOYED_DOMAIN = '404885.dpdns.org';
const YOUR_GEMINI_API_KEY = 'AIzaSyCrbIePTjKzUiAlm2YkXaUEyvZCoyc0tH8'; // ⚠ 建议只在后端用
const MODEL_NAME = 'gemini-2.5-flash';

const input = ref('')
const conversation = ref<any[]>([])  // 存上下文（user + model）
const streamingAnswer = ref('')      // 当前模型正在输出的内容
const error = ref('')

const generateContent = async () => {
  error.value = '';
  streamingAnswer.value = '';

  // 把用户输入加入上下文
  conversation.value.push({
    role: "user",
    parts: [{ text: input.value }]
  })

  try {
    const response = await fetch(
        `https://${YOUR_DEPLOYED_DOMAIN}/v1beta/models/${MODEL_NAME}:streamGenerateContent?alt=sse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": YOUR_GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: conversation.value, // 👈 带上所有上下文（包括 user + model）
            generationConfig: {
              thinkingConfig: {
                thinkingBudget: 0
              }
            }
          })
        }
    );

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    // 临时存放本轮 AI 回复
    let currentModelMsg = { role: "model", parts: [{ text: "" }] }
    conversation.value.push(currentModelMsg)

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") {
            return; // SSE 结束
          }
          try {
            const json = JSON.parse(data);
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              streamingAnswer.value += text;
              // 👇 实时追加到 conversation 中最后一条模型消息
              currentModelMsg.parts[0].text = streamingAnswer.value;
            }
          } catch {
            console.warn("解析失败:", data);
          }
        }
      }
    }
  } catch (e: any) {
    console.error("与 Gemini API 通信失败:", e);
    error.value = `与 Gemini API 通信失败: ${e.message || e.toString()}`;
  } finally {
    input.value = ''
  }
};
</script>

<template>
  <teleport to="#window-view">
    <ViewContainerV2
        :title="props.title"
        :id="props.id"
        @close="emit('close')"
        :icon="props.icon"
    >
      <div class="Gemini">
        <div>
          <input type="text" v-model="input" @keyup.enter="generateContent" placeholder="输入消息">

          <div v-if="error" class="error">{{ error }}</div>

          <!-- 历史对话（包含模型和用户的上下文） -->
          <div v-for="(msg, idx) in conversation" :key="idx" class="message">
            <b>{{ msg.role === 'user' ? '你:' : 'AI:' }}</b> {{ msg.parts[0].text }}
          </div>
        </div>
      </div>
    </ViewContainerV2>
  </teleport>
</template>

<style scoped>
.Gemini {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 100%;
  overflow-y: auto;
  white-space: pre-wrap;
}
.error {
  color: red;
}
.message {
  margin: 4px 0;
}
</style>
