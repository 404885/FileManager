<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'

type SrcType = string | Uint8Array | ArrayBuffer

const props = defineProps<{
  /** 可以传直链 URL、Uint8Array、ArrayBuffer，或不传用输入框加载 */
  src?: SrcType
  /** 初始缩放，默认 1.2（更清晰） */
  initialScale?: number
  /** 单页最大 CSS 宽度（像素），用于限制过宽页面的展示宽度 */
  maxPageCssWidth?: number
}>()

const emit = defineEmits<{
  (e: 'loaded', info: { numPages: number }): void
  (e: 'pagechange', page: number): void
  (e: 'error', msg: string): void
}>()

// UI 状态
const viewerEl = ref<HTMLDivElement | null>(null)
const loading = ref(false)
const errorMsg = ref('')
const numPages = ref(0)
const currentPage = ref(1)
const jumpTarget = ref(1)
const scale = ref(props.initialScale ?? 1.2)

// 画布与页面容器
const canvasRefs: HTMLCanvasElement[] = []
const pageContainers = ref<HTMLDivElement[]>([] as unknown as HTMLDivElement[])

let pdfDoc: any | null = null
let baseViewportWidth = 0 // 用于“适配宽度”基准宽度
let pageCssWidth = 0 // 当前 css 宽度（不等于 canvas 像素宽度）
const urlInput = ref(typeof props.src === 'string' ? (props.src as string) : '')

const dpr = Math.max(1, window.devicePixelRatio || 1)

// --------------- 加载与渲染 ---------------
async function loadDocument(source: SrcType) {
  cleanup()
  loading.value = true
  errorMsg.value = ''
  try {
    const task =
        typeof source === 'string'
            ? pdfjsLib.getDocument({ url: source, withCredentials: false })
            : pdfjsLib.getDocument({ data: new Uint8Array(source) })

    pdfDoc = await task.promise
    numPages.value = pdfDoc.numPages
    jumpTarget.value = 1
    currentPage.value = 1

    await nextTick()
    await renderAllPages()

    emit('loaded', { numPages: numPages.value })
  } catch (err: any) {
    errorMsg.value = `加载失败：${err?.message || err}`
    emit('error', errorMsg.value)
  } finally {
    loading.value = false
    initPageObserver()
  }
}

async function renderAllPages() {
  if (!pdfDoc) return
  // 预先获取第一页，确定“适配宽度”的基准
  const firstPage = await pdfDoc.getPage(1)
  const vpAtScale1 = firstPage.getViewport({ scale: 1 })
  baseViewportWidth = vpAtScale1.width
  computeCssWidth()

  // 顺序渲染所有页（稳定 & 简单）
  for (let i = 1; i <= numPages.value; i++) {
    await renderPage(i)
  }
}

async function renderPage(pageNum: number) {
  if (!pdfDoc) return
  const page = await pdfDoc.getPage(pageNum)
  const viewport = page.getViewport({ scale: scale.value })
  const canvas = canvasRefs[pageNum - 1]
  if (!canvas) return

  // 让画布在高分屏更清晰：物理像素 = CSS 像素 * DPR
  const cssWidth = viewport.width
  const cssHeight = viewport.height
  canvas.style.width = cssWidth + 'px'
  canvas.style.height = cssHeight + 'px'
  canvas.width = Math.floor(cssWidth * dpr)
  canvas.height = Math.floor(cssHeight * dpr)

  const ctx = canvas.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // 以 DPR 缩放绘制

  await page.render({
    canvasContext: ctx,
    viewport,
    // optional: intent: 'print'
  }).promise
}

function computeCssWidth() {
  const container = viewerEl.value
  if (!container || baseViewportWidth === 0) return
  const padding = 16 // .viewer 的左右内边距之和的一半（看下面样式）
  const available = container.clientWidth - padding * 2
  const widthAtScale = baseViewportWidth * scale.value
  pageCssWidth = Math.min(
      props.maxPageCssWidth ?? 1400,
      Math.floor(Math.min(available, widthAtScale))
  )
}

// 重新渲染（缩放/窗口变化）
let rerenderPending = false
async function rerenderAll() {
  if (!pdfDoc || rerenderPending) return
  rerenderPending = true
  computeCssWidth()
  // 使用 requestAnimationFrame 节流
  requestAnimationFrame(async () => {
    for (let i = 1; i <= numPages.value; i++) {
      await renderPage(i)
    }
    rerenderPending = false
  })
}

// --------------- 工具条操作 ---------------
function zoomIn() {
  scale.value = +(scale.value + 0.1).toFixed(3)
  rerenderAll()
}
function zoomOut() {
  scale.value = +(scale.value - 0.1).toFixed(3)
  rerenderAll()
}
function resetZoom() {
  scale.value = props.initialScale ?? 1.2
  rerenderAll()
}
function fitWidth() {
  // 目标：当前 CSS 宽度 ≈ 容器宽度
  const container = viewerEl.value
  if (!container || baseViewportWidth === 0) return
  const padding = 16
  const available = container.clientWidth - padding * 2
  const targetScale = available / baseViewportWidth
  scale.value = +targetScale.toFixed(3)
  rerenderAll()
}
function jumpTo(page: number) {
  const p = Math.max(1, Math.min(numPages.value || 1, Math.floor(page)))
  jumpTarget.value = p
  // 定位到对应页
  const container = viewerEl.value
  const pageEl = pageContainers.value?.[p - 1]
  if (container && pageEl) {
    pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// --------------- 滚动 & 当前页计算 ---------------
let io: IntersectionObserver | null = null
function initPageObserver() {
  // 销毁旧的
  io?.disconnect()
  const container = viewerEl.value
  if (!container) return

  io = new IntersectionObserver(
      entries => {
        // 找到可见比例最大的那个页
        let maxRatio = 0
        let visiblePage = currentPage.value
        for (const e of entries) {
          const ratio = e.intersectionRatio
          if (ratio > maxRatio) {
            maxRatio = ratio
            const el = e.target as HTMLDivElement
            visiblePage = Number(el.dataset.page || 1)
          }
        }
        if (visiblePage !== currentPage.value) {
          currentPage.value = visiblePage
          jumpTarget.value = visiblePage
          emit('pagechange', visiblePage)
        }
      },
      {
        root: container,
        rootMargin: '0px',
        threshold: buildThresholdList(),
      }
  )

  // 观察所有页
  nextTick(() => {
    pageContainers.value?.forEach(el => io?.observe(el))
  })
}

function buildThresholdList() {
  // 生成 0..1 步长 0.05 的阈值，提升“当前页”判断稳定性
  const thresholds: number[] = []
  const steps = 20
  for (let i = 0; i <= steps; i++) thresholds.push(i / steps)
  return thresholds
}

function onScroll() {
  // 如需懒加载/虚拟化，可在这里加逻辑；当前实现一次性渲染全部
}

// --------------- 清理 ---------------
function cleanup() {
  // 清空画布引用
  canvasRefs.length = 0
  pageContainers.value = [] as unknown as HTMLDivElement[]
  numPages.value = 0
  currentPage.value = 1
}

// --------------- 事件绑定 ---------------
function handleResize() {
  fitWidth()
}
onMounted(async () => {
  window.addEventListener('resize', handleResize)

  // 若父组件传了 src，就直接加载；否则等待用户输入
  if (props.src) {
    await loadDocument(props.src)
    // 首次自适应宽度（可按需注释）
    fitWidth()
  } else {
    // 默认填入一个示例 URL（可改）
    urlInput.value = 'F:\\WebStormProject\\FileManager\\public\\testFile\\2024詹勇_毕业设计说明书（论文） - 副本.pdf'
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  io?.disconnect()
})

// --------------- 输入加载 ---------------
function loadFromInput() {
  if (!urlInput.value) return
  window.electronAPI.openFileByPath(urlInput.value).then(response =>{
    if (response.success){
      loadDocument(response.buffer!)
    }else {
      console.error(response.error)
    }
  })
}
</script>

<template>
  <div class="pdf-wrapper">
    <!-- 工具条 -->
    <div class="toolbar">
      <div class="left">
        <input
            v-model="urlInput"
            class="fileAdd-left-content-online-input"
            type="text"
            placeholder="输入 PDF 本地绝对路径"
            @keyup.enter="loadFromInput"
        />
        <button class="btn" @click="loadFromInput">加载</button>
      </div>
      <div class="center">
        <button class="btn" @click="fitWidth">适配宽度</button>
        <button class="btn" @click="resetZoom">100%</button>
      </div>
      <div class="right">
        <input
            class="page-input"
            type="number"
            :min="1"
            :max="numPages || 1"
            v-model.number="jumpTarget"
            @keyup.enter="jumpTo(jumpTarget)"
        />
        <span class="page-info">/ {{ numPages || 0 }}</span>
        <button class="btn" @click="jumpTo(jumpTarget)">跳转</button>
      </div>
    </div>

    <!-- 内容区 -->
    <div ref="viewerEl" class="viewer" @scroll="onScroll">
      <template v-if="loading">
        <div class="loading">正在加载 PDF…</div>
      </template>

      <template v-else-if="errorMsg">
        <div class="error">{{ errorMsg }}</div>
      </template>

      <template v-else>
        <div
            v-for="i in numPages"
            :key="i"
            class="page"
            :style="{ width: pageCssWidth + 'px' }"
            :data-page="i"
            ref="pageContainers"
        >
          <canvas :ref="el => (canvasRefs[i - 1] = el as HTMLCanvasElement)"></canvas>
          <div class="page-number">第 {{ i }} 页</div>
        </div>
      </template>
    </div>
    <div class="Bottom-ToolBar">
      <div class="left">
        <div class="page-tool"></div>
        <span class="page-info">第{{ currentPage }}页</span>
        <span class="page-info">共{{ numPages || 0 }}页</span>
      </div>
      <div class="right">
        <div class="scale-tool">
          <div class="zoom-tool zoom-out" @click="zoomOut"/>
          <span class="scale">{{ Math.round(scale * 100) }}%</span>
          <div class="zoom-tool zoom-in" @click="zoomIn"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pdf-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgb(234, 234, 234);
}

.toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #14161a;
  border-bottom: 1px solid #1e2127;
  color: #e6e6e6;
  font-size: 14px;
}
.toolbar .left,
.toolbar .center,
.toolbar .right {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}
.toolbar .left { justify-content: flex-start; }
.toolbar .right { justify-content: flex-end; }

.fileAdd-left-content-online-input {
  width: 420px;
  max-width: 100%;
  padding: 6px 8px;
  border: 1px solid #2a2f37;
  background: #0f1115;
  color: #e6e6e6;
  border-radius: 8px;
  outline: none;
}
.page-input {
  width: 72px;
  padding: 6px 8px;
  border: 1px solid #2a2f37;
  background: #0f1115;
  color: #e6e6e6;
  border-radius: 8px;
  text-align: center;
  outline: none;
}
.page-info {
  font-size: 0.8rem;
}

.btn {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #2a2f37;
  background: #0f1115;
  color: #e6e6e6;
  cursor: pointer;
}
.btn:hover { background: #171a20; }

.viewer {
  position: relative;
  overflow: auto;
  flex: 1;
  padding: 16px;
}

.loading, .error {
  color: #e6e6e6;
  text-align: center;
  margin-top: 24px;
  opacity: 0.9;
}
.page {
  position: relative;
  width: fit-content;
  margin: 0 auto auto auto;
  padding: 12px 0 12px 0;

  transition: transform .12s ease, border-color .12s ease, box-shadow .12s ease;
}
.page-number {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #b8c1cc;
  opacity: 0.8;
}
canvas {
  display: flex;
  border: 1px solid #575757;
  box-shadow: 0 0 5px #575757;
  padding: 5px;
}
.Bottom-ToolBar{
  display: flex;
  flex-direction: row;
  border-top: 1px solid rgba(188, 188, 188, 0.39);
  box-shadow: 0 -1px 6px -4px #575757;
}
.Bottom-ToolBar .right{
  margin-left: auto;
}
.Bottom-ToolBar .left{
  margin-right: auto;
  margin-left: 15px;
}
.page-tool{
  display: flex;
  flex-direction: row;
  margin: auto;
}
.scale-tool{
  margin: auto 15px auto auto;
  display: flex;
  flex-direction: row;
  user-select: none;
}
.scale {
  width: fit-content;
  margin: auto 10px;
  font-size: 0.8rem;
}
.zoom-tool{
  width: 16px;
  height: 16px;
  margin: auto;
  position: relative;
}
.zoom-tool:hover{
  background: rgba(255, 255, 255, 0.6);
}
.zoom-out::before{
  content: "-";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -3px;
}
.zoom-in::before{
  content: "+";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -3px;
}
</style>
