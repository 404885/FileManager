import { DirectiveBinding } from 'vue'

interface Options {
    min?: number
    max?: number
}

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding<Options>) {
        // 读取可选参数
        const minWidth = binding.value?.min ?? 50
        const maxWidth = binding.value?.max ?? 800

        // 确保父容器能相对定位
        if (getComputedStyle(el).position === 'static') {
            el.style.position = 'relative'
        }

        // 创建“拖拽手柄”
        const handle = document.createElement('div')
        handle.style.cssText = `
      position: absolute;
      top: 0; right: 0; bottom: 0;
      width: 6px;
      cursor: ew-resize;
      user-select: none;
      z-index: 10;
    `
        el.appendChild(handle)

        let startX = 0
        let startW = 0

        const onMouseMove = (e: MouseEvent) => {
            const delta = e.clientX - startX
            let newW = startW + delta
            newW = Math.max(minWidth, Math.min(maxWidth, newW))
            el.style.width = `${newW}px`
        }

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
        }

        handle.addEventListener('mousedown', (e) => {
            e.preventDefault()
            startX = e.clientX
            startW = el.getBoundingClientRect().width
            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
        })
    },
    unmounted(el: HTMLElement) {
        // 清理：把 handle 移除（以及它的事件，因为它挂在自己身上）
        const handle = el.querySelector('div[style*="cursor: ew-resize"]')
        if (handle) el.removeChild(handle)
    }
}
