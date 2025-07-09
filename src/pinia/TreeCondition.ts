import { defineStore } from 'pinia'

export const useTreeCondition= defineStore('TreeCondition', {
    state:() =>({
        changedFolder: -1 as number,
        expandedNode: [] as string[],

        currentWorkspace: 1 as number,
        currentFolder: -1 as number,
    }),
    getters:{
        getChangedFolder(state){
            return state.changedFolder;
        },

        getCurrentWorkSpace(state){
            return state.currentWorkspace;
        },
        getExpanded(state){
            return state.expandedNode;
        }
    },
    actions:{
        setChangedFolder(changedFolder: number){
            this.changedFolder = changedFolder
        },
        setCurrentFolder(currentFolder: number){
            this.currentFolder = currentFolder
        },
        addExpandedNode(id: string) {
            this.expandedNode = [...this.expandedNode, id]
        },
    }
})