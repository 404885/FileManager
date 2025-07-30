// iconRegister.ts
const STORAGE_KEY = 'customFileIconMap'

// 默认图标映射表
const defaultFileIconMap: Record<string, string> = {
    docx: '#Icon-docx',
    xlsx: '#Icon-xlxs',
    pptx: '#Icon-pptx',
    pdf: '#Icon-pdf',
    txt: '#Icon-txt',
    md: '#Icon-txt',
    mp3: '#Icon-music',
    zip: '#Icon-zip',
    html: '#Icon-web',
    htm: '#Icon-web',
    jpg: '#Icon-photo',
    jpeg: '#Icon-photo',
    png: '#Icon-photo',
    gif: '#Icon-photo',
    mp4: '#Icon-video',
    mov: '#Icon-video',
    mkv: '#Icon-video',
    avi: '#Icon-video',
    default: '#Icon-file',
}


// 初始化图标映射（仅首次写入）
function initFileIconMap() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFileIconMap))
    }
}

// 获取映射表
function getFileIconMap(): Record<string, string> {
    const mapStr = localStorage.getItem(STORAGE_KEY)
    return mapStr ? JSON.parse(mapStr) : defaultFileIconMap
}

// 获取某个扩展名对应图标
function getFileIcon(ext: string): string {
    const map = getFileIconMap()
    return map[ext.toLowerCase()] || map.default
}

// 更新映射（合并或替换）
function setFileIconMap(newMap: Record<string, string>, merge = true) {
    const current = getFileIconMap()
    const updated = merge ? { ...current, ...newMap } : newMap
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

// 清除映射（可选）
function clearFileIconMap() {
    localStorage.removeItem(STORAGE_KEY)
}

// 初始化执行
initFileIconMap()

export {
    getFileIcon,
    getFileIconMap,
    setFileIconMap,
    clearFileIconMap,
    defaultFileIconMap
}
