import { useTreeCondition } from '@/pinia/TreeCondition'

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