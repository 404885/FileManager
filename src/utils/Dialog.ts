// utils/Dialog.ts
import { createApp, h} from 'vue'
import ModalDialog from '../components/Dialog/ModalDialog.vue'
import FileAddDialog from "../components/Dialog/child/FileAddDialog.vue";
import FileEditDialog from "@/components/Dialog/child/FileEditDialog.vue";
import SettingDialog from "../components/Dialog/child/SettingDialog.vue";
import UserDialog from "../components/Dialog/child/UserDialog.vue";


let DialogMap = {
    addFile: FileAddDialog,
    editFile: FileEditDialog,
    setting: SettingDialog,
    user: UserDialog,
}


interface DialogOptions {
    type: keyof typeof DialogMap   // 要渲染的组件
    props?: Record<string, any> | null  // 给该组件传的 props
    modalProps?: Record<string, any> // 给 ModalDialog 自身传的 props（比如标题）
}

export function openDialog({ type, props = {}, modalProps = {} }: DialogOptions) {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const app = createApp({
        render(){
            return h(ModalDialog,
                {
                ...modalProps,
                onClose: () => {
                    app.unmount()
                    container.remove()
                }
            },{
                default: () => h(DialogMap[type], props)
            })
        }
    })

    app.mount(container)
}
