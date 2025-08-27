import App from './App.vue'
import {createApp} from 'vue'
import {createPinia} from "pinia";

import {GlobalWorkerOptions} from 'pdfjs-dist'
import worker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
GlobalWorkerOptions.workerSrc = worker;

import './style/base.css'

import ElementPlus from 'element-plus'
import router from '@/router'

// import 'virtual:svg-icons-register'


import {injectSymbol} from "@/utils/Map.ts";

await injectSymbol()

const pinia = createPinia()


const app = createApp(App)
    .use(ElementPlus)
    .use(pinia)
    .use(router)
    .mount('#app')

export default app
