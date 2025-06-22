import { defineStore } from 'pinia'

export const useTreeCondition= defineStore('TreeCondition', {
    state:() =>({
        changedFolder: -1 as number,

    }),
    getters:{
        getChangedFolder(state){
            return state.changedFolder;
        }
    },
    actions:{
        setChangedFolder(changedFolder: number){
            this.changedFolder = changedFolder
        }
    }
})