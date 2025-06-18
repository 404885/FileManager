// iconRegister.ts
const STORAGE_KEY = 'customFileIconMap'

// 默认图标映射表
const defaultIconMap = {
    docx: 'icon-docx',
    xlsx: 'icon-xlxs',
    pptx: 'icon-pptx',
    pdf: 'icon-pdf',
    txt: 'icon-txt',
    md: 'icon-txt',
    mp3: 'icon-music',
    zip: 'icon-zip',
    html: 'icon-web',
    htm: 'icon-web',
    jpg: 'icon-photo',
    jpeg: 'icon-photo',
    png: 'icon-photo',
    gif: 'icon-photo',
    mp4: 'icon-video',
    mov: 'icon-video',
    mkv: 'icon-video',
    avi: 'icon-video',
    default: 'icon-file'
}

// 如果 localStorage 中没有映射，就写入默认映射
const exist = localStorage.getItem(STORAGE_KEY)
if (!exist) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultIconMap))
}
