// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';



const routers = createRouter({
    history: createWebHashHistory(),
    routes: [
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
