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
    { to: '/', icon: '#icon-home' },
    { to: '/space', icon: '#icon-project' },
    { to: '/tag', icon: '#icon-tags' },
    { to: '/recent', icon: '#icon-time-circle' },
    { to: '/like', icon: '#icon-star' },
    { to: '/connect', icon: '#icon-share' }
]

/* SideBar设置页面跳转 */
const sideBottomData = [
    { to: '/user', icon: '#icon-user' },
    { to: '/setting', icon: '#icon-setting' },
]

export {
    nodeData,
    sideTopData,
    sideBottomData
}