import { defineStore } from 'pinia'

export const useResourceCondition = defineStore('folderStore', {
    state: () => ({
        dataChange: null as any | null,

        folders: {} as Record<string, {
            id: string;
            name: string;

            currentFolder: number | 0;
            currentSpace: number | 0;
        }>,
    }),
    actions: {
        setDataChange(newChange: any) {
            this.dataChange = newChange;
        },

    }
})
