// const defaultMappings = [
//     ['pdf', 'pdf'],
//     ['docx', 'word'],
//     ['doc', 'word'],
//     ['xlsx', 'excel'],
//     ['xls', 'excel'],
//     ['png', 'photo'],
//     ['jpg', 'photo'],
//     ['jpeg', 'photo'],
//     ['gif', 'photo'],
//     ['svg', 'photo'],
//     ['mp4', 'video'],
//     ['mp3', 'audio'],
//     ['zip', 'zip'],
//     ['rar', 'zip'],
//     ['7z', 'zip'],
//     ['txt', 'txt'],
//     ['json', 'code'],
//     ['js', 'code'],
//     ['ts', 'code'],
//     ['html', 'code'],
//     ['css', 'code']
// ];
//
// function extractPaths(node:any) {
//     if (!node) return []
//
//     const childrenPaths = (node.children || []).flatMap(extractPaths)
//     return node.path ? [node.path, ...childrenPaths] : childrenPaths
// }


export async function netSymbol() {

}


export async function transSymbol(path:any){
    const paths = Array.isArray(path) ? path : [path];
    const symbols = []

    for (const path of paths) {
        const res = await window.electronAPI.svgTransform(path)
        if (res.success){
            console.log(res)
            symbols.push(res.symbol)
        }
    }
    console.log(symbols)
    return symbols;
}

/* */
export async function createSymbol(path: any){
    const paths = Array.isArray(path) ? path : [path];
    const symbols: string[] = [];

    for (const path of paths) {
        const res = await fetch(path);
        const svgContent = await res.text()
        const matches = [...svgContent.matchAll(/<symbol[\s\S]*?<\/symbol>/g)]

        for (const match of matches) {
            symbols.push(match[0]);
        }
    }
    for (const symbol of symbols) {
        const symbolId = symbol.match(/<symbol[^>]*id="([^"]+)"[^>]*>/)?.[1]!;

        const symbolName = symbolId.split('-')[1]
        await window.electronAPI.dataOperation.execute(
            `INSERT INTO icon (icon_name, icon_value, icon_type, symbol_id, create_time, update_time, level)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [symbolName, symbol, 'system', symbolId, Date.now(), Date.now(), 0])
    }
    return symbols;
}


export async function createMap(map: any){
    const maps = Array.isArray(map) ? map : [map];

    for (const [ext, icon] of maps) {
        await window.electronAPI.dataOperation.execute(
            `INSERT OR IGNORE INTO icon_map (extension, icon_name) VALUES (?, ?)`,
            [ext, icon]
        );
    }
}



export async function injectSymbol() {
    if (document.getElementById('__svg-symbols__')) return

    // let data = await window.electronAPI.dataOperation.queryAll('SELECT * FROM icon')
    // let symbols = data.map(s => s.icon_value)

    let result = await window.electronAPI.svgsTransform('./icon')
    const symbols = result.symbols as unknown as string[];



    // let pathall = []
    // const res = await window.electronAPI.openDirectoryDialog()
    // if (!res.canceled) {
    //     const node = res.files
    //     pathall = extractPaths(node)
    //     console.log(pathall)
    // }
    // await transSymbol(pathall)


    // if (!data || data.length === 0) {
    //     symbols = await createSymbol('/sprite.svg');
    //
    //     for (const [ext, icon] of defaultMappings) {
    //         await window.electronAPI.dataOperation.execute(
    //             `INSERT OR IGNORE INTO icon_map (extension, icon_name) VALUES (?, ?)`,
    //             [ext, icon]
    //         );
    //     }
    // }

    // 构造完整 SVG 内容
    const rawSvg = `<svg id="__svg__icons__dom__" xmlns="http://www.w3.org/2000/svg" style="position: absolute; width: 0; height: 0;"> ${symbols.join('\n')}</svg>`
    const container = document.createElement('div')
    container.innerHTML = rawSvg.trim()
    document.body.appendChild(container.firstElementChild!)
}

