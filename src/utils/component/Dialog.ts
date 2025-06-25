// utils/Dialog.ts
import { createApp, h} from 'vue'
import FileAddDialog from "@/components/Dialog/FileAddDialog.vue";
import FileEditDialog from "@/components/Dialog/FileEditDialog.vue";
import SettingDialog from "@/components/Dialog/SettingDialog.vue";
import UserDialog from "@/components/Dialog/UserDialog.vue";


let DialogMap = {
    addFile: FileAddDialog,
    editFile: FileEditDialog,
    setting: SettingDialog,
    user: UserDialog,
}


interface DialogOptions {
    type: keyof typeof DialogMap   // 要渲染的组件
    props?: Record<string, any> | null  // 给该组件传的 props
    onConfirm?: (data: any) => void  // 加上这个回调参数
    onClose?: (data?: any) => void
}

interface DialogResult {
    fileName: string
}

export function openDialog({ type, props = {}, onConfirm }: DialogOptions ) {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const app = createApp({
        render(){
            return h(DialogMap[type],
                {
                    ...props,
                    onClose: () => {
                        app.unmount()
                        container.remove()
                    },
                    onConfirm: (data: any) => {
                        onConfirm && onConfirm(data)  // 调用外部传入的回调
                    }
            })
        }
    })

    app.mount(container)
}

export function openDialogAsync(options: DialogOptions): Promise< DialogResult | null > {
    return new Promise((resolve) => {
        openDialog({
            ...options,
            onConfirm(data) {
                resolve(data)   // 用户确认时，resolve数据
            },
            onClose() {
                resolve(null)   // 关闭时，也resolve，避免挂起
            }
        })
    })
}