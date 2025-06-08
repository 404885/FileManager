// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';



const routers = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'index',
            component: import('../view/index.vue'),
        },
        {
            path: '/user',
            name: 'user',
            component: import('../view/UserView.vue'),
        },
        {
            path: '/main',
            name: 'main',
            component: import('../view/MainView.vue'),
            meta: {
                DetailBar: 'home',
            }
        },
        {
            path: '/recent',
            name: 'recent',
            component: import('../view/RecentView.vue'),
        },
        {
            path: '/tag',
            name: 'tag',
            component: import('../view/TagView.vue'),
            meta: {
                DetailBar: 'tag',
            }
        },
        {
            path: '/like',
            name: 'like',
            component: import('../view/LikeView.vue'),
        },
        {
            path: '/connect',
            name: 'connect',
            component: import('../view/ConnectView.vue'),
        },
    ]
})

export default routers;
