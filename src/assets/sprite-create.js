import fs from 'fs';
import path from 'path';

const inputDir = './icon'; // 放你的 svg 文件
const outputFile = './sprite.svg';

let symbols = '';

fs.readdirSync(inputDir).forEach(file => {
    if (file.endsWith('.svg')) {
        const filePath = path.join(inputDir, file);
        let content = fs.readFileSync(filePath, 'utf-8');

        const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
        const innerContent = content
            .replace(/<svg[^>]*>/, '')
            .replace('</svg>', '')
            .trim();

        const id = 'icon-' + path.basename(file, '.svg');
        const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 64 64';

        symbols += `<symbol id="${id}" viewBox="${viewBox}">${innerContent}</symbol>\n`;
    }
});

const result = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none"><defs>\n${symbols}</defs></svg>`;
fs.writeFileSync(outputFile, result, 'utf-8');
console.log('✅ sprite.svg 已生成');
