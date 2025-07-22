import { createApp } from 'vue'
import VideoIframe from '@/components/Dialog/showDialog.vue'

const CONTAINER_ID = 'global-video-container'

/**
 * 动态添加全局挂载容器（只创建一次）
 */
function ensureContainer(): HTMLElement {
    let container = document.getElementById(CONTAINER_ID)
    if (!container) {
        container = document.createElement('div')
        container.id = CONTAINER_ID
        container.style.position = 'absolute'
        container.style.top = '0'
        container.style.left = '0'
        container.style.width = '100vw'
        container.style.height = '100vh'
        container.style.display = 'flex'
        container.style.flexWrap = 'wrap'
        container.style.zIndex = '100000'
        document.body.appendChild(container)
    }
    return container
}

/**
 * 每次调用往容器里添加一个新的 iframe 组件
 */
export function appendVideoIframe() {
    const container = ensureContainer()

    const wrapper = document.createElement('div') // 包裹单个组件
    wrapper.style.pointerEvents = 'auto' // 允许内部组件响应事件
    container.appendChild(wrapper)

    const instance = createApp(VideoIframe)
    instance.mount(wrapper)
}
