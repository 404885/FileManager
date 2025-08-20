import { defineStore } from 'pinia'


export interface ResourceFolderState {
    folders: any[]  // 你资源管理器特有的数据，比如文件夹列表等
    selectedId: string | null
    // 其他实例私有状态
}

export const useResourceCondition = defineStore('ResourceCondition', {
    state: () => ({
        instances: {} as Record<string, ResourceFolderState>,
        // 公用状态，比如：
        // globalSetting: { theme: 'light' },
    }),
    getters: {
        getInstance: (state) => {
            return (id: string) => state.instances[id]
        },
    },
    actions: {
        // 初始化某个资源管理器实例状态
        initInstance(id: string) {
            if (!this.instances[id]) {
                this.instances[id] = {
                    folders: [],
                    selectedId: null,
                }
            }
        },
        // 更新某个实例的文件夹数据
        setFolders(id: string, folders: any[]) {
            if (this.instances[id]) {
                this.instances[id].folders = folders
            }
        },
        setSelected(id: string, selectedId: string) {
            if (this.instances[id]) {
                this.instances[id].selectedId = selectedId
            }
        },
        // 删除实例
        removeInstance(id: string) {
            delete this.instances[id]
        },
        // 公用状态修改
        setGlobalTheme(theme: string) {
            this.globalSetting.theme = theme
        }
    }
})
