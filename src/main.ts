import { createApp } from 'vue'
import App from './App.vue'
import '@/style.css'
import ElementPlus from 'element-plus'
import router from '@/router.ts'
import {createPinia} from "pinia";
import 'element-plus/dist/index.css'
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxeUIAll from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

const pinia = createPinia()

createApp(App)
    .use(ElementPlus)
    .use(router)
    .use(pinia)
    .use(VxeUIAll)
    .use(VxeUITable)
    .mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})