import type { Component } from 'vue'
import { asyncOpenComponent, openComponent } from '@/utils/util.ts'
import ContextMenu from "@/components/Menu/ContextMenu.vue"
import ContextMenuV1 from "@/components/Menu/ContextMenuV1.vue"






// 定义菜单类型映射
const MenuMap: Record<'contextMenu' | 'contextMenuV1', Component> = {
    contextMenu: ContextMenu,
    contextMenuV1: ContextMenuV1,
}

// 定义 Options 接口
interface Options {
    type: keyof typeof MenuMap  // 菜单类型
    props?: Record<string, any> | null  // 传递的参数
    resolve?: (item: any) => void  // 结果回调
    async?: boolean  // 是否异步打开
}

// 通用的菜单打开函数，封装了同步/异步的处理
function openMenuComponent(options: Options) {
    const component = MenuMap[options.type]
    const resolvedProps = { ...options.props, resolve: options.resolve || (() => {}) }

    if (options.async) {
        return asyncOpenComponent(component, resolvedProps)
    } else {
        return openComponent(component, resolvedProps)
    }
}

// 异步打开菜单
export function openMenuAsync(options: Options) {
    return openMenuComponent({ ...options, async: true })
}

// 同步打开菜单
export function openMenu(options: Options) {
    return openMenuComponent({ ...options, async: false })
}

