import { defineStore } from 'pinia'
import {DraggableContainer} from "@/utils/type.ts";

export const useDeskTopCondition = defineStore('DeskTopCondition', {
    state: () => ({
        iconBoxes: {} as Record<string, DraggableContainer>,
        volume:0.1 as number,
    }),
    getters:{
      getVolume():number{
          return this.volume;
      }
    },
    actions: {
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
        }
    }
})