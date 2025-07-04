
// 一个单双击处理回调函数
export function useHandleClick(delay = 250) {
    let clickTimer: ReturnType<typeof setTimeout> | null = null
    let lastClickTime = 0

    function handleClick(
        node: any,
        singleClickFn: (data: any) => void,
        doubleClickFn: (data: any) => void
    ) {
        const now = Date.now()
        if (clickTimer) {
            // 已有未处理的单击定时器，判断两次点击间隔
            if (now - lastClickTime < delay) {
                // 双击，清除定时器，触发双击事件
                clearTimeout(clickTimer)
                clickTimer = null
                doubleClickFn(node)
            } else {
                // 点击间隔大于 delay，先触发单击，再重新计时
                singleClickFn(node)
                lastClickTime = now
            }
        } else {
            // 第一次点击，设置单击定时器
            lastClickTime = now
            clickTimer = setTimeout(() => {
                singleClickFn(node)
                clickTimer = null
            }, delay)
        }
    }

    return { handleClick }
}
