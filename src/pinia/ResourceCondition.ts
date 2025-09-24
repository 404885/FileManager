import { defineStore } from 'pinia'

export const useResourceCondition = defineStore('folderStore', {
    state: () => ({
        dataChange: null as any | null,
        id: '' as string,
        name: '' as string,
        currentFolder: -1 as number,
        currentSpace: 1 as number,
    }),
    actions: {
        setDataChange(newChange: any) {
            this.dataChange = newChange;
        },

        setFolderChange(newFolder: any) {
            this.currentFolder = newFolder;
        },
        setSpaceChange(newSpace: any) {
            this.currentSpace = newSpace;
        }

    }
})
