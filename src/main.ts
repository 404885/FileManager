import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from "pinia";

import VxeUITable from 'vxe-table'
import VxeUIAll from 'vxe-pc-ui'

import './style/base.css'
import './style/iconfont.js'
import './utils/iconMap.ts'

import ElementPlus from 'element-plus'
import router from '@/router'
import directives from "@/directives";



const pinia = createPinia()

createApp(App)
    .use(ElementPlus)
    .use(directives)
    .use(pinia)
    .use(router)
    .use(VxeUIAll)
    .use(VxeUITable)
    .mount('#app')