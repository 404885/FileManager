import { defineStore } from 'pinia'
import {DraggableContainer} from "@/utils/type.ts";

export const useResourceCondition = defineStore('DeskTopCondition', {
    state: () => ({
        iconBoxes: {} as Record<string, DraggableContainer>,
        application: [] as {id:string,icon:string}[],
        minimizedWindows: {} as Record<string, boolean>,
        volume:0.1 as number,
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
                const idx = state.application.findIndex(app => app.id === id)
                return idx === -1 ? 0 : idx + 10
            }
        },
        isMinimized: (state) => {
            return (id: string) => state.minimizedWindows[id] ?? false
        },
        getVolume: (state) => {
            return state.volume
        },
        getApp: (state) => {
            return state.application
        },
    },
    actions: {
        init(app: {id:string, icon:string}) {
            if (!this.application.some(a => a.id === app.id)) {
                this.application.push(app)
            }
        },
        bringToFront(id: string) {
            const index = this.application.findIndex(app => app.id === id)
            if (index !== -1) {
                const app = this.application.splice(index, 1)[0]
                this.application.push(app)
            }
        },
        setVolume(volume: number) {
            this.volume = volume
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
        removeApplication(id: string) {
            const index = this.application.findIndex(app => app.id === id)
            if (index !== -1) {
                this.application.splice(index, 1)
            }
            delete this.minimizedWindows[id]
        },
        resetWindowOffset() {
            this.windowOffset.x = 0;
            this.windowOffset.y = 0;
        },
        desktopInitialize(){

        },
    }
})