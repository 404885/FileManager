// src/directives/index.ts
import type { App, Directive } from 'vue'
import resizable from '@/directives/resizable.ts'

const directives: Record<string, Directive> = {
    "resizable": resizable,
}

export {
    resizable,
}

export default {
    install(app: App) {
        Object.entries(directives).forEach(([name, directive]) => {
            app.directive(name, directive)
        })
    },
}
