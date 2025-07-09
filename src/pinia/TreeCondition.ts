import { defineStore } from 'pinia'

export const useTreeCondition= defineStore('TreeCondition', {
    state:() =>({
        changedState: -1 as number,
        expandedNode: [] as string[],

        currentWorkspace: 1 as number,
        currentFolder: -1 as number,
    }),
    getters:{
        getChangedState(state){
            return state.changedState;
        },

        getCurrentWorkSpace(state){
            return state.currentWorkspace;
        },
        getCurrentFolder(state){
          return state.currentFolder;
        },
        getExpanded(state){
            return state.expandedNode;
        }
    },
    actions:{
        setChangedState(changedState: number){
            this.changedState = changedState;
        },
        setCurrentFolder(currentFolder: number){
            this.currentFolder = currentFolder
        },
        addExpandedNode(id: string) {
            this.expandedNode = [...this.expandedNode, id]
        },
        removeExpandedNode(id: string) {
            const index = this.expandedNode.indexOf(id)
            this.expandedNode.splice(index, 1)
        },
        setCurrentWorkspace(workspace: number){
            this.currentWorkspace = workspace
        }
    }
})