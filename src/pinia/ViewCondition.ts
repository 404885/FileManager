import { defineStore } from 'pinia'

export const useViewCondition= defineStore('ViewCondition', {
    state:() =>({
        displayOrder : [] as string[],
    }),
    getters:{
        computeZIndex: (state) => {
            return (id: string) => {
                const idx = state.displayOrder.indexOf(id)
                return idx === -1 ? 0 : idx + 10
            }
        },
    },
    actions:{
        init(id: string) {
            if (!this.displayOrder.includes(id)) {
                this.displayOrder.push(id)
            }
        },
        bringToFront(id: string) {
            const index = this.displayOrder.indexOf(id)
            if (index !== -1) {
                this.displayOrder.splice(index, 1)
            }
            this.displayOrder.push(id)
        },
    }
})