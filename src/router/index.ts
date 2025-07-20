// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';



const routers = createRouter({
    history: createWebHashHistory(),
    routes: [
        // {
        //     path: '/space',
        //     name: 'space',
        //     component: () => import('../view/IndexView.vue'),
        //     meta: {
        //         DetailBar: 'space',
        //     },
        // },
        {
            path: '/space/:catchAll(.*)*',
            component: () => import('../view/TestView.vue'),
            // meta: {
            //     DetailBar: 'space',
            // },
        },
        {
            path: '/user',
            name: 'user',
            component: () => import('../view/UserView.vue'),
        },
        {
            path: '/:catchAll(.*)*',
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

// routers.beforeEach((to, _from, next) => {
//     // 假设你想让根路径 '/' 默认带上 workspace 和 folder 参数
//     if (to.path === '/space' && !to.query.workspace && !to.query.folder) {
//         let workspace = 1;
//         let folder = null;
//
//         const lastWorkspace = localStorage.getItem('lastWorkspace');
//         const lastFolder = localStorage.getItem('lastFolder');
//
//         console.log(lastWorkspace, lastFolder);
//         if (lastWorkspace !== undefined){
//             workspace = Number(lastWorkspace);
//         }
//         if (lastFolder !== undefined){
//             folder = Number(lastFolder);
//         }
//
//         console.log(workspace,folder)
//
//         next({
//             path: '/space',
//             query: {
//                 workspace,
//                 folder,
//             }
//         });
//     } else {
//         next();
//     }
// });

export default routers;
