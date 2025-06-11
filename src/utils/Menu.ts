import { createApp, h} from 'vue'
import ContextMenu from "@/components/Menu/ContextMenu.vue";

let currentInstance: ReturnType<typeof createApp> | null = null

// interface MenuOptions {
//     modalProps?: Record<string, any> // 给 ModalDialog 自身传的 props（比如标题）
// }

export function openMenu(modalProps:any) {

    if (currentInstance) {
        currentInstance.unmount()
        const el = document.getElementById('dynamic-menu')
        el && el.remove()
    }

    const container = document.createElement('div')
    container.id = 'dynamic-menu'
    document.body.appendChild(container)

    const app = createApp({
        render(){
            return h(ContextMenu,
                {
                    ...modalProps,
                    onClose: () => {
                        app.unmount()
                        container.remove()
                        currentInstance = null
                    }},{
                        // default: () => h(DialogMap[type], props)
            })
        }
    })
    app.mount(container)
    currentInstance = app
}