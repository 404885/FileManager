import App from './App.vue'
import {createApp} from 'vue'
import {createPinia} from "pinia";
import {injectSymbol} from "@/utils/Map.ts";

import {GlobalWorkerOptions} from 'pdfjs-dist'
import worker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
GlobalWorkerOptions.workerSrc = worker;


import VxeTable from 'vxe-table'
import ElementPlus from 'element-plus'

import 'vxe-table/lib/style.css'
import './style/base.css'


import router from '@/router'

// import 'virtual:svg-icons-register'



await injectSymbol()

const pinia = createPinia()


const app = createApp(App)
    .use(ElementPlus)
    .use(pinia)
    .use(VxeTable)
    .use(router)
    .mount('#app')

export default app
