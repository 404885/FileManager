// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';



const routers = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/space',
            name: 'space',
            component: () => import('../view/index.vue'),
            meta: {
                DetailBar: 'space',
            }
        },
        {
            path: '/user',
            name: 'user',
            component: () => import('../view/UserView.vue'),
        },
        {
            path: '/',
            name: 'main',
            component: () => import('../view/MainView.vue'),

        },
        {
            path: '/recent',
            name: 'recent',
            component: () => import('../view/RecentView.vue'),
        },
        {
            path: '/tag',
            name: 'tag',
            component: () => import('../view/TagView.vue'),
            meta: {
                DetailBar: 'tag',
            }
        },
        {
            path: '/like',
            name: 'like',
            component: () => import('../view/LikeView.vue'),
        },
        {
            path: '/connect',
            name: 'connect',
            component: () => import('../view/ConnectView.vue'),
        },
        {
            path: '/setting',
            name: 'setting',
            component: () => import('../view/SettingView.vue'),
        },

    ]
})

export default routers;
