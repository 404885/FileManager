// src/directives/v-resizable.ts
import { DirectiveBinding } from 'vue'

interface Options {
    min?: number
    max?: number
    storageKey?: string
    persist?: boolean
}

interface ElWithResize extends HTMLElement {
    _handle?: HTMLElement
    _onPointerMove?: (e: PointerEvent) => void
    _onPointerUp?: (e: PointerEvent) => void
    _saveOnUnload?: () => void
}

export default {
    mounted(el: ElWithResize, binding: DirectiveBinding<Options>) {
        const { min = 50, max = 800, storageKey, persist = true } = binding.value || {}

        // 恢复宽度
        if (storageKey && persist) {
            const saved = localStorage.getItem(storageKey)
            if (saved !== null) el.style.width = saved
        }

        // 确保定位
        if (getComputedStyle(el).position === 'static') {
            el.style.position = 'relative'
        }

        // 创建手柄
        const handle = document.createElement('div')
        Object.assign(handle.style, {
            position: 'absolute',
            top: '0',
            right: '0',
            bottom: '0',
            width: '6px',
            cursor: 'ew-resize',
            userSelect: 'none',
            zIndex: '10',
        })
        el.appendChild(handle)
        el._handle = handle

        let startX = 0
        let startW = 0
        let rafId: number | null = null

        const onPointerMove = (e: PointerEvent) => {
            if (rafId !== null) return
            rafId = requestAnimationFrame(() => {
                const delta = e.clientX - startX
                let w = startW + delta
                w = Math.max(min, Math.min(max, w))
                el.style.width = `${w}px`
                rafId = null
            })
        }

        const onPointerUp = (e: PointerEvent) => {
            handle.releasePointerCapture(e.pointerId)
            document.removeEventListener('pointermove', el._onPointerMove!)
            document.removeEventListener('pointerup', el._onPointerUp!)
            el.style.willChange = ''
            document.body.style.userSelect = ''
            document.body.style.cursor = ''

            // 拖拽结束时保存
            if (storageKey && persist) {
                localStorage.setItem(storageKey, el.style.width)
            }
        }

        handle.addEventListener('pointerdown', (e: PointerEvent) => {
            e.preventDefault()
            startX = e.clientX
            startW = el.getBoundingClientRect().width
            el.style.willChange = 'width'
            document.body.style.userSelect = 'none'
            document.body.style.cursor = 'ew-resize'
            handle.setPointerCapture(e.pointerId)
            document.addEventListener('pointermove', onPointerMove)
            document.addEventListener('pointerup', onPointerUp)
        })

        el._onPointerMove = onPointerMove
        el._onPointerUp = onPointerUp

        // —— 兜底：页面卸载前保存一次 ——
        const saveOnUnload = () => {
            if (storageKey && persist) {
                localStorage.setItem(storageKey, el.style.width)
            }
        }
        window.addEventListener('beforeunload', saveOnUnload)
        // 对于某些移动端或 PWA，也可以用 pagehide：
        window.addEventListener('pagehide', saveOnUnload)
        el._saveOnUnload = saveOnUnload
    },

    unmounted(el: ElWithResize) {
        // 移除手柄
        if (el._handle && el.contains(el._handle)) {
            el._handle.removeEventListener('pointerdown', () => {})
            el.removeChild(el._handle)
        }
        // 移除卸载事件
        if (el._saveOnUnload) {
            window.removeEventListener('beforeunload', el._saveOnUnload)
            window.removeEventListener('pagehide', el._saveOnUnload)
        }
        // 清理引用
        delete el._handle
        delete el._onPointerMove
        delete el._onPointerUp
        delete el._saveOnUnload
    },
}
