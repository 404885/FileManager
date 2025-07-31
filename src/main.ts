import App from './App.vue'
import {createApp} from 'vue'
import {createPinia} from "pinia";

import VxeUITable from 'vxe-table'
import VxeUIAll from 'vxe-pc-ui'
import 'virtual:svg-icons-register'

import './style/base.css'
import './utils/iconMap.ts'

import ElementPlus from 'element-plus'
import router from '@/router'

import 'virtual:svg-icons-register'
// import {appendVideoIframe} from "@/utils/VideoPopUp.ts";


const pinia = createPinia()


export const app = createApp(App) // 直接将创建的 app 实例赋值给导出的 app 变量
    .use(ElementPlus)
    .use(pinia)
    .use(router)
    .use(VxeUIAll)
    .use(VxeUITable)
    .mount('#app')

// window.addEventListener('click', () => {
//     appendVideoIframe()
//     // 如果想点一次关闭，可以结合 closeVideoIframe()
// })