import { useTreeCondition } from '@/pinia/TreeCondition'
import { createApp, h, type Component, type App } from 'vue'

// 为 props 定义一个通用类型
interface ComponentProps {
    [key: string]: any;
}
let currentSyncInstance: App | null = null
let currentAsyncInstance: App | null = null


/*  递归查询父文件夹，得到一个路径列表。
*
*   @param id 查询文件夹的Id
*   @param name 当前点击文件夹的名称
*
*   @returns 返回一个路径列表
*/
export async function idToPath(id: number): Promise<string[]> {
    // 定义一个路径列表
    const path: string[] = []
    // 递归函数
    async function recurse(currentId: number) {
        // 查询
        const rows = await window.electronAPI.dataOperation.queryAll(
            'SELECT * FROM portfolio WHERE id = ? LIMIT 1',
            [currentId]
        )
        // 得到查询结果
        const data = rows[0]
        // 如果查询为空则直接返回
        if (!data) return
        // 将前面得到的name保存
        path.unshift(data.name)
        // 若父文件夹不为零，则递归查找
        if (data.associated_folder !== null) {
            await recurse(data.associated_folder)
        }
    }
    // 调用递归函数
    await recurse(id)
    // 返回路径
    return path
}

export async function idToPathList(id: number, workspaceId: number): Promise<any[]> {
    const path: any[] = []
    // 如果是根层级，仅返回工作空间节点
    if (id === -1) {
        const ws = await window.electronAPI.dataOperation.queryOne(
            'SELECT id, name FROM workspace WHERE id = ? LIMIT 1',
            [workspaceId]
        )
        if (ws) {
            path.push({
                id: -1,
                name: ws.name,
                workspace: ws.id
            })
        }
        return path
    }



    let workspaceInfo: any = null

    async function recurse(currentId: number) {
        const rows = await window.electronAPI.dataOperation.queryAll(
            'SELECT * FROM portfolio WHERE id = ? LIMIT 1',
            [currentId]
        )
        const data = rows[0]
        if (!data) return

        if (!workspaceInfo) {
            const ws = await window.electronAPI.dataOperation.queryOne(
                'SELECT id, name FROM workspace WHERE id = ? LIMIT 1',
                [data.connected_workspace]
            )
            if (ws) workspaceInfo = ws
        }

        path.unshift({
            id: data.id,
            name: data.name,
            workspace: data.connected_workspace
        })

        if (data.associated_folder !== null) {
            await recurse(data.associated_folder)
        }
    }

    await recurse(id)

    if (workspaceInfo) {
        path.unshift({
            id: -1,
            name: workspaceInfo.name,
            workspace: workspaceInfo.id
        })
    }

    return path
}
// 设置当前活跃的w和f，并跳转刷新页面数据（因为监听的是地址）
export async function setAndJump(workspaceId: number, folderId: number, router: any): Promise<void> {
    const store = useTreeCondition()
// 获取当前的路由参数
    const currentWorkspace = store.currentWorkspace
    const currentFolder = store.currentFolder

    if (workspaceId !== currentWorkspace || folderId !== currentFolder) {
        store.setCurrentWorkspace(workspaceId)
        store.setCurrentFolder(folderId)
        await router.push({ path: '/space', query: { w: workspaceId, f: folderId } })
    }

}

export const formatter ={
    timeFormatter(timestamp: number): string {
        const now = Date.now();
        const diffMs = now - timestamp;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays < 1) return '今天';
        if (diffDays < 31) return `${diffDays}天前`;

        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}年${month}月${day}日`;
    }

}


// 同步调用openComponent，返回 Promise，可以获取组件传出的数据
export function openComponent(ComponentCtor: Component, props: ComponentProps, singleton = true): void {
    console.log('openComponent called with props:', props, 'singleton:', singleton)

    const container = document.createElement('div')
    container.className = 'sync-component-container'
    document.body.appendChild(container)

    // 如果是单例模式，先卸载已有实例
    if (singleton && currentSyncInstance) {
        currentSyncInstance.unmount()
        const old = document.querySelector('.sync-component-container')
        container.dataset.id = Date.now().toString()
        old?.remove()
        currentSyncInstance = null
    }

    const app = createApp({
        render() {
            return h(ComponentCtor, {
                ...props,
                onClose: (payload?: any) => {
                    app.unmount()
                    container.remove()
                    if (singleton) currentSyncInstance = null
                    props?.onClose?.(payload) // 透传原始回调
                }
            })
        }
    })

    app.mount(container)

    if (singleton) {
        currentSyncInstance = app
    }
}
// 异步调用的 openComponent，返回 Promise，可以获取组件传出的数据
export function asyncOpenComponent<T = any>(ComponentCtor: Component, props: ComponentProps = {}): Promise<T> {
    return new Promise((resolve) => {
        if (currentAsyncInstance) {
            currentAsyncInstance.unmount()
            document.getElementById('async-component')?.remove()
        }

        const container = document.createElement('div')
        container.id = 'async-component'
        document.body.appendChild(container)

        const app = createApp({
            render() {
                return h(ComponentCtor, {
                    ...props,
                    onClose: (result: T) => {
                        resolve(result)  // 异步回调，传递返回值
                        app.unmount()
                        container.remove()
                        currentAsyncInstance = null
                    }
                })
            }
        })

        app.mount(container)
        currentAsyncInstance = app
    })
}

// 一个单双击处理回调函数
export function useHandleClick(delay = 250) {
    let clickTimer: ReturnType<typeof setTimeout> | null = null
    let lastClickTime = 0

    function handleClick(
        node: any,
        singleClickFn: (data: any) => void,
        doubleClickFn: (data: any) => void
    ) {
        const now = Date.now()
        if (clickTimer) {
            // 已有未处理的单击定时器，判断两次点击间隔
            if (now - lastClickTime < delay) {
                // 双击，清除定时器，触发双击事件
                clearTimeout(clickTimer)
                clickTimer = null
                doubleClickFn(node)
            } else {
                // 点击间隔大于 delay，先触发单击，再重新计时
                singleClickFn(node)
                lastClickTime = now
            }
        } else {
            // 第一次点击，设置单击定时器
            lastClickTime = now
            clickTimer = setTimeout(() => {
                singleClickFn(node)
                clickTimer = null
            }, delay)
        }
    }

    return { handleClick }
}
