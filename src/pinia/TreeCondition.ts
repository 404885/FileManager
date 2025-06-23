import { defineStore } from 'pinia'

export const useTreeCondition= defineStore('TreeCondition', {
    state:() =>({
        changedFolder: -1 as number,
        expandedNode: [] as string[],

    }),
    getters:{
        getChangedFolder(state){
            return state.changedFolder;
        },
        getExpanded(state){
            return state.expandedNode;
        }
    },
    actions:{
        setChangedFolder(changedFolder: number){
            this.changedFolder = changedFolder
        },
        setChangedExpanded(idList: string[]){
            this.expandedNode = idList
        }


    }
})