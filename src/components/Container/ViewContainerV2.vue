<script setup lang="ts">
import {onMounted, ref} from "vue";
import interact from 'interactjs'
import {ViewContainer} from "@/utils/type.ts";

const props = defineProps<{
  title?: string,
  width?: number,
  height?: number,
}>()

const viewContainer = ref<HTMLElement | null>(null);

const containerProperty = ref<ViewContainer>({
  id: Date.now(),
  x: 0,
  y: 0,
  width: props.width || 600,
  height: props.height || 450,
})

function updateTransform() {
  if (!viewContainer.value) return
  const el = viewContainer.value
  el.style.transform = `translate(${containerProperty.value.x}px, ${containerProperty.value.y}px)`
  el.style.width = `${containerProperty.value.width}px`
  el.style.height = `${containerProperty.value.height}px`
}

onMounted(() => {
  const el = viewContainer.value!
  interact(el)
      // 拖拽限制在父容器内
      .draggable({
        allowFrom: '.title-bar',
        ignoreFrom: '.content',
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',    // 限制在父元素内
            endOnly: true,            // 只有拖拽结束时才会修正位置
          }),
        ],
        listeners: {
          start() {
            el.classList.add('interacting')
          },
          move(event) {
            containerProperty.value.x += event.dx
            containerProperty.value.y += event.dy
            updateTransform()
          },
          end() {
            el.classList.remove('interacting')
          },
        },
      })

      // 缩放限制在父容器内
      .resizable({
        edges:  { top: true, left: true, bottom: true, right: true },
        ignoreFrom: '.content',
        modifiers: [
          // 大小范围限制
          interact.modifiers.restrictSize({
            min: { width: 600, height: 450 },
            max: { width: 1200, height: 900 },
          }),
          // 缩放后依然保持在父容器内部
          interact.modifiers.restrictEdges({
            outer: 'parent',         // 外边界限制在父元素
            endOnly: true,           // 结束时修正
          }),
        ],
        listeners: {
          start()   { el.classList.add('interacting') },
          move(event) {
            containerProperty.value.width  = event.rect.width
            containerProperty.value.height = event.rect.height
            containerProperty.value.x += event.deltaRect.left
            containerProperty.value.y += event.deltaRect.top
            updateTransform()
          },
          end()     { el.classList.remove('interacting') },
        },
      })

  updateTransform()
})


const emit = defineEmits(['close'])


function close(){
  emit('close', "dsadsa")
}


</script>

<template>
  <div class="view-container" ref="viewContainer">
    <div class="title-bar" >
      <div class="traffic-lights-wrapper">
        <div class="traffic-lights">
          <div class="traffic-light red non-drag" @click="close" title="关闭"></div>
          <div class="traffic-light yellow non-drag" data-action="minimize" title="最小化"></div>
          <div class="traffic-light green" data-action="maximize" title="最大化"></div>
        </div>
      </div>
      <span class="title">{{ props.title || '默认应用'}}</span>
      <slot name="title-slot" />
    </div>
    <div class="content-wrapper">
      <div class="content">
        <slot/>
      </div>
    </div>
  </div>
</template>

<style scoped>

.view-container {
  border-radius: 6px;
  display: flex;
  flex-direction: column;

  position: absolute;
  top: 10%;
  left: 10%;

  overflow: hidden;
  resize: both;

  min-width: 600px;
  min-height: 450px;
  will-change: transform;

  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.05);
  background-blend-mode: overlay; /* 增强层次感 */
  transition: background 0.3s ease;
}

.title-bar {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  min-height: 32px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  position: relative;
  border-bottom: 1px solid #e0e0e0; /* Subtle separator */
  will-change: transform;
  background: transparent;
}
.traffic-lights-wrapper{
  height: 100%;
}
.traffic-lights {
  display: flex;
  gap: 8px;
  cursor: default;
  z-index: 100000;
  height: 100%;
}
.traffic-light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  margin: auto 0;
  transition: all 0.1s ease-in-out;
}
.traffic-light.red {
  background-color: #ff5f57;
}
.traffic-light.yellow {
  background-color: #ffbd2e;
}
.traffic-light.green {
  background-color: #28c940;
}
.traffic-light:hover {
  opacity: 0.8;
}

.title {
  font-size: 14px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.content-wrapper{
  width: 100%;
  height: 100%;
  padding: 0 5px 5px 5px;
}
.content{
  width: 100%;
  height: 100%;
}
.view-container.interacting .content {
  pointer-events: none;
}

</style>