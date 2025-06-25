import { defineStore } from 'pinia'

export const useFileCondition= defineStore('FileCondition', {
    state:() =>({
        changedFolder: -1 as number,
    }),
    getters:{
        getChangedFolder(state){
            return state.changedFolder;
        },
    },
    actions:{
        setChangedFolder(changedFolder: number){
            this.changedFolder = changedFolder
        },
    }
})