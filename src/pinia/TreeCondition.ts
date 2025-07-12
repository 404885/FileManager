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
            if (!this.expandedNode.includes(id)) {
                this.expandedNode = [...this.expandedNode, id]
            }
        },
        removeExpandedNode(id: string) {
            this.expandedNode = this.expandedNode.filter(i => i !== id)
        },
        setCurrentWorkspace(workspace: number){
            this.currentWorkspace = workspace
        }
    }
})