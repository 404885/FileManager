// src/directives/resizableVertical.ts
import { DirectiveBinding } from 'vue'

interface ElWithHandle extends HTMLElement {
    _resizeHandle?: HTMLElement
    _onMouseMove?: (e: MouseEvent) => void
    _onMouseUp?: () => void
}

type Options = {
    min?: number
    max?: number
    handlePosition?: 'top' | 'bottom'  // 新增：手柄位置
}

export default {
    mounted(el: ElWithHandle, binding: DirectiveBinding<Options>) {
        const minH = binding.value?.min ?? 50
        const maxH = binding.value?.max ?? Infinity
        const pos = binding.value?.handlePosition ?? 'bottom'

        // 保证容器定位与初始高度
        if (getComputedStyle(el).position === 'static') {
            el.style.position = 'relative'
        }
        if (!el.style.height) {
            el.style.height = `${el.getBoundingClientRect().height}px`
        }
        el.style.overflow = 'hidden'

        // 创建拖拽手柄
        const handle = document.createElement('div')
        handle.style.cssText = `
      position: absolute;
      left: 0;
      ${pos}: 0;      /* 动态放到 top 或 bottom */
      width: 100%;
      height: 6px;
      cursor: ns-resize;
      user-select: none;
      z-index: 10;
    `
        el.appendChild(handle)
        el._resizeHandle = handle

        let startY = 0
        let startH = 0

        const onMouseMove = (e: MouseEvent) => {
            const delta = e.clientY - startY
            let newH: number
            if (pos === 'bottom') {
                // 底部手柄：向下拉（delta>0）增高
                newH = startH + delta
            } else {
                // 顶部手柄：向上拉（delta<0）增高
                newH = startH - delta
            }
            newH = Math.max(minH, Math.min(maxH, newH))
            el.style.height = `${newH}px`
        }

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
        }

        handle.addEventListener('mousedown', (e) => {
            e.preventDefault()
            startY = e.clientY
            startH = el.getBoundingClientRect().height
            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
        })

        el._onMouseMove = onMouseMove
        el._onMouseUp = onMouseUp
    },

    beforeUnmount(el: ElWithHandle) {
        if (el._resizeHandle) {
            el.removeChild(el._resizeHandle)
            delete el._resizeHandle
        }
        if (el._onMouseMove && el._onMouseUp) {
            document.removeEventListener('mousemove', el._onMouseMove)
            document.removeEventListener('mouseup', el._onMouseUp)
            delete el._onMouseMove
            delete el._onMouseUp
        }
    }
}
