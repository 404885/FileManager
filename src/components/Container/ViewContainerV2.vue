<script setup lang="ts">
import {onMounted, ref} from "vue";
import interact from 'interactjs'
import {DraggableContainer} from "@/utils/type.ts";
import {useDeskTopCondition} from "@/pinia/DeskTopCondition.ts";

const props = defineProps<{
  id:string,
  icon:string,
  title?: string,
  width?: number,
  height?: number,
}>()
const emit = defineEmits(['close'])

const store = useDeskTopCondition()

const viewContainer = ref<HTMLElement | null>(null);
const ratio = window.devicePixelRatio

const isMaximized = ref(false)

const offset = store.getNextPosition()

const originalPosition = ref({
  x: offset.x,
  y: offset.y,
  width: 0,
  height: 0,
})

const containerProperty = ref<DraggableContainer>({
  id:props.id,
  x: offset.x,
  y: offset.y,
  width: props.width || 800,
  height: props.height || 600,
})

function updateTransform() {
  if (!viewContainer.value) return;
  const el = viewContainer.value;

  // 1. 先把累积的 CSS 逻辑像素 * ratio → 得到物理像素
  // 2. Math.round → 对齐到最接近的设备像素
  // 3. 再 / ratio → 回到 CSS 像素单位
  const x = Math.round(containerProperty.value.x * ratio) / ratio;
  const y = Math.round(containerProperty.value.y * ratio) / ratio;

  const w = Math.round(containerProperty.value.width  * ratio) / ratio;
  const h = Math.round(containerProperty.value.height * ratio) / ratio;

  el.style.transform = `translate(${x}px, ${y}px)`;
  el.style.width     = `${w}px`;
  el.style.height    = `${h}px`;
}
onMounted(() => {
  const el = viewContainer.value!
  interact(el)
      // 拖拽限制在父容器内
    .draggable({
        allowFrom: '.title-bar',
        ignoreFrom: '.content',
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
        edges:  { top: false, left: true, bottom: true, right: true },
        ignoreFrom: '.content',
        modifiers: [
          // 大小范围限制
          interact.modifiers.restrictSize({
            min: { width: 600, height: 450 },
          }),
          // 缩放后依然保持在父容器内部
          interact.modifiers.restrictEdges({
            outer: 'parent',         // 外边界限制在父元素
            endOnly: true,           // 结束时修正
          }),
        ],
        listeners: {
          start(){ el.classList.add('interacting') },
          move(event) {
            containerProperty.value.width  = event.rect.width
            containerProperty.value.height = event.rect.height
            containerProperty.value.x += event.deltaRect.left
            containerProperty.value.y += event.deltaRect.top
            updateTransform()
          },
          end(){ el.classList.remove('interacting') },
        },
      })
  updateTransform()

  store.init({
    id: props.id,
    icon: props.icon,
  })
  bringToFront()
})

function close(){
  emit('close')
  store.removeApplication(props.id)
}
function maximize() {
  const el = viewContainer.value
  if (!el || !el.parentElement) return

  const parentRect = el.parentElement.getBoundingClientRect()

  if (!isMaximized.value) {
    // 记录原位置和大小
    originalPosition.value = {
      x: containerProperty.value.x,
      y: containerProperty.value.y,
      width: containerProperty.value.width,
      height: containerProperty.value.height,
    }
    // 最大化：设置位置为 (0,0)，大小为父容器宽高
    containerProperty.value.x = 0
    containerProperty.value.y = 0
    containerProperty.value.width = parentRect.width
    containerProperty.value.height = parentRect.height

    isMaximized.value = true
  } else {
    // 还原
    const prev = originalPosition.value
    containerProperty.value.x = prev.x
    containerProperty.value.y = prev.y
    containerProperty.value.width = prev.width
    containerProperty.value.height = prev.height

    isMaximized.value = false
  }

  updateTransform()
}

function onTitlebarDblclick(e: MouseEvent) {
  const target = e.target as HTMLElement

  if (
      target.closest('.traffic-light') ||
      target.closest('.traffic-lights') ||
      target.closest('.title') ||
      target.closest('.title-slot')
  ) {
    return
  }

  maximize()
}
function bringToFront(){
  store.bringToFront(containerProperty.value.id)
}

function minimize() {
  store.minimizeWindow(containerProperty.value.id)
}

</script>

<template>
  <div class="view-container" ref="viewContainer" v-show="!store.isMinimized(containerProperty.id)" :style="{zIndex:store.computeZIndex(containerProperty.id)}" @mousedown="bringToFront()">
    <div class="title-bar" @dblclick="onTitlebarDblclick">
      <div class="traffic-lights-wrapper">
        <div class="traffic-lights">
          <div class="traffic-light red" @click="close" title="关闭"></div>
          <div class="traffic-light yellow" @click="minimize" data-action="minimize" title="最小化"></div>
          <div class="traffic-light green" @click="maximize" data-action="maximize" title="最大化"></div>
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
  top: 0;
  left: 0;

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
  transition: background,width,height,left,top 0.3s ease;
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
  cursor: pointer;
}
.traffic-lights-wrapper{
  height: 100%;
}
.traffic-lights {
  display: flex;
  gap: 8px;
  cursor: default;
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
  height: calc(100% - 32px);
  padding: 0 3px 5px 3px;
}
.content{
  width: 100%;
  height: 100%;
}
.view-container.interacting .content {
  pointer-events: none;
}

</style>