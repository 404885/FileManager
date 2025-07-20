/* DetailSpace快捷节点 */
const nodeData = [
    { label: '全部文档', icon: '#icon-file1' },
    { label: '切换空间', icon: '#icon-compass', action: 'workChange' },
    { label: '搜索结果', icon: '#icon-filesearch' },
    { label: '收藏夹', icon: '#icon-heart' },
    { label: '回收站', icon: '#icon-delete' },
    { label: '草稿箱', icon: '#icon-edit-square' },
]

/* SideBar功能页面跳转 */
const sideTopData = [
    { to: '/', icon: '#icon-home', text: '主页'},
    { to: `/space`, icon: '#icon-project', text: '文档'},
    { to: '/tag', icon: '#icon-tags', text: '标签'},
    { to: '/recent', icon: '#icon-time-circle', text: '最近'},
    { to: '/like', icon: '#icon-star', text: '收藏'},
]

/* SideBar设置页面跳转 */
const sideBottomData = [
    { to: '/connect', icon: '#icon-share', text: ''},
    { to: '/user', icon: '#icon-user' , text: '用户'},
    { to: '/setting', icon: '#icon-setting' , text: '设置'},
]

const headData = [
    { label: '打开', key: 'open' },
    { label: '重命名', key: 'rename' },
    { label: '复制', key: 'copy' },
    { label: '剪切', key: 'cut' },
    { label: '移动', key: 'move' },
    { label: '属性', key: 'property' },
    { label: '删除', key: 'delete', danger: true }
]

export {
    nodeData,
    sideTopData,
    sideBottomData,
    headData
}