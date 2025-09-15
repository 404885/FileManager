/* DetailSpace快捷节点 */
import { reactive } from "vue";
import { Applications } from "@/utils/type.ts";
import {Util} from "@/utils/index.ts";
import ResourceFolder from "@/components/Application/ResourceFolder/ResourceFolder.vue";
import WebBrowser from "@/components/Application/WebBrowser.vue";
import Preview from "@/components/Application/Preview.vue";
import Chat from "@/components/Application/Chat.vue";
import Gemini from "@/components/Application/Gemini.vue";

export const nodeData = [
    { label: '工作空间', icon: 'pdf', action: '', key: 'workspace'},
    { label: '文档', icon: '#Icon-compass', action: '', key: 'collection' },
    { label: '最近浏览', icon: '#Icon-filesearch', key: 'recent'},
    { label: '收藏夹', icon: '#Icon-heart', key: 'favorite'},
    { label: '回收站', icon: '#Icon-delete', key: 'delete'},
    { label: '标签', icon: '#Icon-delete', key: 'delete'},
    { label: '关系图', icon: '#Icon-delete', key: 'delete'},
    { label: '未分类', icon: '#Icon-edit-square', key: 'draft'},
    { label: '图片', icon: '#Icon-edit-square', key: 'draft'},
    { label: '视频', icon: '#Icon-edit-square', key: 'draft'},
    { label: '音频', icon: '#Icon-edit-square', key: 'draft'},
    { label: '文档', icon: '#Icon-edit-square', key: 'draft'},
]

/* SideBar功能页面跳转 */
export const sideTopData = [
    { to: '/', icon: '#Icon-home', text: '主页'},
    { to: `/space`, icon: '#Icon-project', text: '文档'},
    { to: '/tag', icon: '#Icon-tags', text: '标签'},
    { to: '/recent', icon: '#Icon-time-circle', text: '最近'},
    { to: '/like', icon: '#Icon-star', text: '收藏'},
]

/* SideBar设置页面跳转 */
export const sideBottomData = [
    { to: '/connect', icon: '#Icon-share', text: ''},
    { to: '/user', icon: '#Icon-user' , text: '用户'},
    { to: '/setting', icon: '#Icon-setting' , text: '设置'},
]

export const headData = [
    { label: '名称', key: 'name' },
    { label: '创建时间', key: 'create_time' },
    { label: '上次浏览', key: 'last_browser-time' },
    { label: '文本', key: 'txt'},
    { label: '数字', key: 'num' },
    { label: '链接', key: 'link' },
    { label: '日期', key: 'date' },
    { label: '单选框', key: 'choose' },
    { label: '附件', key: 'attach' },
    { label: '描述', key: 'describe' },
    { label: '标签', key: 'key' }
]

export const workspaceData = [
    {label: 'music', key: 'audio' },
    {label: 'files', key: 'txt'},
    {label: 'image', key: 'photo' },
    {label: 'download'},
    {label: 'video', key: 'video'},
]

export const iconData = [

]

export const applicationData = reactive<Applications[]>([
    {
        id:crypto.randomUUID(),
        name:'资源管理器',
        icon:'file_explorer',
        dblclick(){
            Util.openComponent(ResourceFolder, this.id,{ title: '资源管理器',id:crypto.randomUUID(),icon:this.icon,}, false)
        },
        async contextMenu(e:MouseEvent){
            e.stopPropagation()
            // const result = await Util.asyncOpenComponent(MenuContainerV1,'1', {
            //     position: { x: e.clientX, y: e.clientY },
            //     data:  [
            //         { name: "O2 1", icon: "icon1", click: () => {}},
            //         { name: "Op3ion 2", icon: "icon2", click: () => {}},
            //         { name: "1n 3", icon: "icon2", click: () => {}},
            //     ],
            // })
            // console.log(result)
        },
    },
    {
        id:crypto.randomUUID(),
        name:'回收站',
        icon:'recycle_bin',
        dblclick(){

        },
        contextMenu(e:MouseEvent){
            e.stopPropagation()
        },
    },
    {
        id:crypto.randomUUID(),
        name:'浏览器',
        icon:'chrome',
        dblclick(){
            Util.openComponent(WebBrowser,this.id,{ title: '浏览器' ,url : 'https://www.bing.com',id:crypto.randomUUID(),icon:this.icon, },false)
        },
        contextMenu(e:MouseEvent){
            e.stopPropagation()
        },
    },
    {
        id:crypto.randomUUID(),
        name:'通讯',
        icon:'messages',
        dblclick(){
            Util.openComponent(Chat,this.id,{title:'通讯',id:this.id,icon:this.icon,})
        },
        contextMenu(e:MouseEvent){
            e.stopPropagation()
        },
    },
    {
        id: crypto.randomUUID(),
        name: 'PDF',
        icon:'pdf',
        dblclick(){
            Util.openComponent(Preview,this.id,{title:'PDF预览',id:crypto.randomUUID(),icon:this.icon,type:'pdf',src:'F:\\WebStormProject\\FileManager\\public\\testFile\\2024詹勇_毕业设计说明书（论文） - 副本.pdf'},false)
        },
        contextMenu(e:MouseEvent){
            e.stopPropagation()
        },
    },
    {
        id: crypto.randomUUID(),
        name: 'Gemini',
        icon:'google',
        dblclick(){
            Util.openComponent(Gemini,this.id,{title:'Gemini',id:this.id,icon:this.icon})
        },
        contextMenu(e:MouseEvent){
            e.stopPropagation()
        },
    }
])

export const deskContextMenuData = []