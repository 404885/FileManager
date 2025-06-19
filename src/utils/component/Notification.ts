import { ElNotification } from 'element-plus'
import { h } from 'vue'

interface Options{
    message: string,
    duration?: number,
    type?: 'success' | 'warning' | 'info' | 'error',
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
}

export function showNotification({message, duration, position, type}:Options) {
    ElNotification({
        position,
        message: h('div', { class: 'noti-wrapper' }, [
            h('div', { class: 'noti-text' }, message),
            h('div', {
                class: 'noti-progress',
                style: { animationDuration: `${duration}ms`}
            })
        ]),
        type,
        duration,
        customClass: 'noti-with-progress',
    }

    )
}
