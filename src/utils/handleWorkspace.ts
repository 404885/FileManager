

/*  设置工作空间和文件夹,DetailSpace挂载的时候可以设置顶层文件夹为活跃（或是保持上次打开）
*
*   @param workspaceId 工作空间的id
*   @param folderId    文件夹的id
*/
function setCurrentInfo(workspaceId: number, folderId: number, folderPath: string) {
    // 存储当前活跃的 workspace ID
    localStorage.setItem('current_workspace', workspaceId.toString())
    // 存储当前活跃的 folder ID
    localStorage.setItem('current_folder_id', folderId.toString())
    localStorage.setItem('current_folder_path', folderPath)

}

function getCurrentInfo(){
    const workspace = Number(localStorage.getItem('current_workspace'))
    const folderId = Number(localStorage.getItem('current_folder_id'))
    return [workspace, folderId]
}


/*  递归查询父文件夹，得到一个路径列表。
*
*   @param id 查询文件夹的Id
*   @param name 当前点击文件夹的名称
*
*   @returns 返回一个路径列表
*/
async function idToPath(id: number, name: string): Promise<string[]> {
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
    path.push(name)
    // 返回路径
    return path
}

export {
    setCurrentInfo,
    getCurrentInfo,
    idToPath,
}