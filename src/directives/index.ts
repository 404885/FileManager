// src/directives/index.ts
import type { App, Directive } from 'vue'
import resizable from '@/directives/resizable.ts'
import drag from '@/directives/drag.ts'

const directives: Record<string, Directive> = {
    "resizable": resizable,
    "drag": drag,
}

export {
    resizable,
    drag,
}

export default {
    install(app: App) {
        Object.entries(directives).forEach(([name, directive]) => {
            app.directive(name, directive)
        })
    },
}
