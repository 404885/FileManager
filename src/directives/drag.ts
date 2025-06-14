export default {
    mounted(el: HTMLElement) {
        el.setAttribute('draggable', 'true')

        el.addEventListener('dragstart', (e) => {
            console.log('[dragstart]')
            // 非空才能启用拖拽 (必须要)
            e.dataTransfer?.setData('text/plain', 'drag')
            el.classList.add('dragging')
        })

        el.addEventListener('dragend', () => {
            el.classList.remove('dragging')
        })

        el.addEventListener('dragover', (e) => {
            e.preventDefault() // 防止阻止默认拖拽行为
        })

        el.addEventListener('drop', (e) => {
            e.preventDefault() // 否则浏览器阻止拖放行为
        })
    }
}
