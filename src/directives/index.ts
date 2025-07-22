// // src/directives/index.ts
// import type { App, Directive } from 'vue';
// import resizable from '@/directives/resizable.ts'; // 确保 resizable 也只默认导出了指令对象
// import { Vdrag } from '@/directives/drag.ts'; // 从 drag.ts 导入默认导出的 drag 指令对象
//
// // 定义一个对象，键是指令名（在模板中使用 v-xxx 时，xxx 就是这个键），值是指令的定义
// const directives: Record<string, Directive> = {
//     // 这里的值是导入的指令对象
//     "resizable": resizable,
//     "drag": Vdrag,
// };
//
// // 如果需要单独按需导入指令，可以保留命名导出
// export {
//     resizable,
//     Vdrag,
// };
//
// // 默认导出一个包含 install 方法的对象，使其成为一个 Vue 插件
// export default {
//     install(app: App) {
//         // 遍历所有指令并注册它们
//         Object.entries(directives).forEach(([name, directive]) => {
//             app.directive(name, directive);
//         });
//     },
// };