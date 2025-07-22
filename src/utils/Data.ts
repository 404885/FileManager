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

export {
    nodeData,
    sideTopData,
    sideBottomData,
    headData
}