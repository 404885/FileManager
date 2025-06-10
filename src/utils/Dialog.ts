// utils/Dialog.ts
import { createApp, h } from 'vue'
import ModalDialog from '../components/Dialog/ModalDialog.vue'
import FileOpenDialog from "../components/Dialog/child/FileOpenDialog.vue";

const DialogMap = {
    openFile: FileOpenDialog,

}

export function openDialog() {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const app = createApp({
        render() {
            return h(ModalDialog,
                {
                    onClose: () => {
                    app.unmount()
                    container.remove()
                }
            },
                {
                    default: () => h(FileOpenDialog),
                })
        }
    })

    app.mount(container)
}
