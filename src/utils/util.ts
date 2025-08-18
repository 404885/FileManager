import { useTreeCondition } from '@/pinia/TreeCondition'
import {createApp, h, type Component} from 'vue'
import {DOUBLE_CLICK_THRESHOLD, LOCK_DURATION} from "@/utils/constant.ts";


// 为 props 定义一个通用类型
interface ComponentProps {
    [key: string]: any;
}
// let currentSyncInstance: App | null = null

const currentSyncInstances = new Map<string, ReturnType<typeof createApp>>()

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


export function openComponent(ComponentCtor: Component,instanceId: string, props?: ComponentProps, singleton = true): void {
    console.log('openComponent called with props:', props, 'singleton:', singleton, 'instanceId:', instanceId)

    if (singleton && instanceId) {
        // 卸载已有同 instanceId 实例
        const existingApp = currentSyncInstances.get(instanceId)
        if (existingApp) {
            existingApp.unmount()
            currentSyncInstances.delete(instanceId)
            const old = document.querySelector(`.sync-component-container[data-instance-id="${instanceId}"]`)
            old?.remove()
        }
    }

    const container = document.createElement('div')
    container.className = 'sync-component-container'
    if (instanceId) container.dataset.instanceId = instanceId
    document.body.appendChild(container)

    const app = createApp({
        render() {
            return h(ComponentCtor, {
                ...props,
                onClose: (payload?: any) => {
                    app.unmount()
                    container.remove()
                    if (singleton && instanceId) {
                        currentSyncInstances.delete(instanceId)
                    }
                    props?.onClose?.(payload)
                }
            })
        }
    })

    app.mount(container)

    if (singleton && instanceId) {
        currentSyncInstances.set(instanceId, app)
    }
}
// 异步调用版本，支持 instanceId + singleton 控制，返回 Promise 获取返回值
export function asyncOpenComponent<T = any>(ComponentCtor: Component, instanceId: string, props: ComponentProps = {}, singleton = true): Promise<T> {
    return new Promise((resolve) => {
        // 单例模式下卸载已有实例
        if (singleton && instanceId) {
            const existingApp = currentSyncInstances.get(instanceId)
            if (existingApp) {
                existingApp.unmount()
                currentSyncInstances.delete(instanceId)
                document.querySelector(`.sync-component-container[data-instance-id="${instanceId}"]`)?.remove()
            }
        }

        const container = document.createElement('div')
        container.className = 'sync-component-container'
        if (instanceId) container.dataset.instanceId = instanceId
        document.body.appendChild(container)

        const app = createApp({
            render() {
                return h(ComponentCtor, {
                    ...props,
                    resolve,  // 自动注入 resolve
                    onClose: (payload?: T) => {
                        resolve(payload as T)  // 组件关闭时返回值
                        app.unmount()
                        container.remove()
                        if (singleton && instanceId) {
                            currentSyncInstances.delete(instanceId)
                        }
                        props?.onClose?.(payload)
                    }
                })
            }
        })

        app.mount(container)

        if (singleton && instanceId) {
            currentSyncInstances.set(instanceId, app)
        }
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
// 对openDirectoy进行解析，得到一个扁平的路径文件
export function extractPaths(node:any) {
    if (!node) return []

    const childrenPaths = (node.children || []).flatMap(extractPaths)
    return node.path ? [node.path, ...childrenPaths] : childrenPaths
}
// 一个单双击处理回调函数,传入回调函数，分别是id 单击事件 双击事件
export function useClickHandler<T>(getId: (node: T) => string , singleClickFn?: (node: T) => void, doubleClickFn?: (node: T) => void, doubleClickThreshold: number = DOUBLE_CLICK_THRESHOLD, lockDuration: number = LOCK_DURATION) {

    const lastClickTimes = new Map<string, number>()
    const lockMap = new Map<string, boolean>()
    const timers = new Map<string, ReturnType<typeof setTimeout>>()

    function handleClick(node: T) {
        const now = Date.now()
        const id = getId(node)

        const isLocked = lockMap.get(id) ?? false
        if (isLocked) return

        const lastClickTime = lastClickTimes.get(id) ?? 0

        // 是否是双击
        if (now - lastClickTime < doubleClickThreshold) {
            if (timers.has(id)) {
                clearTimeout(timers.get(id)!)
                timers.delete(id)
            }

            if (doubleClickFn) {
                doubleClickFn(node)

                // 加锁
                lockMap.set(id, true)
                setTimeout(() => {
                    lockMap.set(id, false)
                }, lockDuration)
            }
        } else {
            if (singleClickFn) {
                // 启动一个延迟触发（防止误触双击）
                const timer = setTimeout(() => {
                    singleClickFn(node)
                    timers.delete(id)

                    // 加锁
                    lockMap.set(id, true)
                    setTimeout(() => {
                        lockMap.set(id, false)
                    }, lockDuration)
                }, doubleClickThreshold)

                timers.set(id, timer)
            }
        }

        lastClickTimes.set(id, now)
    }

    return { handleClick }
}






