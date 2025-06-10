import type { App } from 'vue'
import type { Directive } from 'vue'
import resizable from '@/directives/resizable.ts'

interface DirectivesMap {
    [key: string]: Directive
}

// 所有指令的集合
const directives: DirectivesMap = {
    resizable: resizable
    // 添加更多指令...
}

// 插件安装方法
export default {
    install(app: App) {
        Object.keys(directives).forEach(key => {
            // 注册指令，自动添加 'v-' 前缀
            app.directive(key, directives[key])
        })
    }
}

// 可选：导出单个指令（按需引入时使用）
export {
    resizable,
}