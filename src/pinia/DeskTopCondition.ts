import { defineStore } from 'pinia'
import {DraggableContainer} from "@/utils/type.ts";

export const useDeskTopCondition = defineStore('DeskTopCondition', {
    state: () => ({
        iconBoxes: {} as Record<string, DraggableContainer>,
        application: {} as Record<string, {id:string,icon:string}>, // 改成对象存储，方便查找
        displayOrder: [] as string[], // 专门控制窗口显示顺序
        bottomBarOrder: [] as string[], // 底部任务栏顺序
        activateMenu: '' as string,
        minimizedWindows: {} as Record<string, boolean>,
        isMuted: false as boolean,
        volume:Number(localStorage.getItem("volume") ?? 0.1),
        volumeIcon:'volume' as string,
        now:  new Date(),
        windowOffset: {
            x: 15,
            y: 15,
        },
        offsetStep: 15 as number,
        offsetLimit: 300 as number,
    }),
    getters:{
        computeZIndex: (state) => {
            return (id: string) => {
                const idx = state.displayOrder.findIndex(appId => appId === id)
                return idx === -1 ? 0 : idx + 10
            }
        },
        isMinimized: (state) => {
            return (id: string) => state.minimizedWindows[id] ?? false
        },
        getVolume: (state) => {
            if (state.isMuted){
                return 0
            }else {
                return state.volume
            }
        },
        getVolumeIcon: (state) => {
            if (state.isMuted || Number(state.volume) === 0) {
                return 'no_audio'
            }
            return 'volume'
        },
        getApp: (state) => {
            return state.application
        },
        getBottomBarApps: (state) => {
            return state.bottomBarOrder
                .map(id => state.application[id])
                .filter(Boolean)
        },
        getActivateMenu: (state) =>{
            return state.activateMenu
        },
    },
    actions: {
        init(app: {id:string, icon:string}) {
            if (!this.application[app.id]) {
                this.application[app.id] = app
                this.displayOrder.push(app.id)
                this.bottomBarOrder.push(app.id) // 初始化时加到任务栏
                this.minimizedWindows[app.id] = false
            }
        },
        setBottomBarOrder(newOrder: string[]) {
            this.bottomBarOrder = [...newOrder]
        },
        bringToFront(id: string) {
            const index = this.displayOrder.findIndex(appId => appId === id)
            if (index !== -1) {
                this.displayOrder.splice(index, 1)
                this.displayOrder.push(id)
            }
        },
        mute(){
            this.isMuted = !this.isMuted;
        },
        unMute(){
            this.isMuted = false;
        },
        setVolume(volume: number) {
            this.volume = volume
        },
        setActivateMenu(activateMenu: string = '') {
          this.activateMenu = activateMenu
        },
        updateIconBox(box: DraggableContainer) {
            this.iconBoxes[box.id] = box
        },
        removeIconBox(id: string) {
            delete this.iconBoxes[id]
        },
        isColliding(current: DraggableContainer) {
            return Object.values(this.iconBoxes).some(icon => {
                if (icon.id === current.id) return false
                return !(
                    current.x + current.width <= icon.x ||
                    current.x >= icon.x + icon.width ||
                    current.y + current.height <= icon.y ||
                    current.y >= icon.y + icon.height
                )
            })
        },
        getNextPosition() {
            const offset = { ...this.windowOffset };

            this.windowOffset.x += this.offsetStep;
            this.windowOffset.y += this.offsetStep;

            if (this.windowOffset.x > this.offsetLimit || this.windowOffset.y > this.offsetLimit) {
                this.windowOffset.x = 0;
                this.windowOffset.y = 0;
            }

            return offset;
        },
        minimizeWindow(id: string) {
            this.minimizedWindows[id] = true
        },
        restoreWindow(id: string) {
            this.minimizedWindows[id] = false
            this.bringToFront(id)
        },
        minimizeAllWindow(){
            for (const key in this.minimizedWindows) {
                this.minimizedWindows[key] = true
            }
        },
        removeApplication(id: string) {
            if (this.application[id]) {
                delete this.application[id]
            }

            // 删除 displayOrder
            this.displayOrder = this.displayOrder.filter(appId => appId !== id)

            // 删除 bottomBarOrder
            if (this.bottomBarOrder) {
                this.bottomBarOrder = this.bottomBarOrder.filter(appId => appId !== id)
            }

            // 删除最小化状态
            if (this.minimizedWindows[id]) {
                delete this.minimizedWindows[id]
            }
        },
        resetWindowOffset() {
            this.windowOffset.x = 0;
            this.windowOffset.y = 0;
        },
        desktopInitialize(){
            this.application = {}
            this.displayOrder = []
            this.minimizedWindows = {}
            this.resetWindowOffset()
        },
    }
})