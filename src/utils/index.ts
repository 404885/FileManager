import { openDialog,openDialogAsync } from "@/utils/component/Dialog.ts"
import { openNotification } from "@/utils/component/Notification.ts";


import { nodeData,sideTopData,sideBottomData,headData,workspaceData,applicationData } from "@/utils/Data.ts";
import {
    formatter,
    idToPath,
    idToPathList,
    setAndJump,
    openComponent,
    asyncOpenComponent,
    useHandleClick,
} from "@/utils/util.ts";



import { vDrag } from "@/utils/directives/drag.ts";
import { vResize } from "@/utils/directives/resizable.ts";

export {
    vDrag,
    vResize
}

export const Data = {
    nodeData,
    sideTopData,
    sideBottomData,
    headData,
    workspaceData,
    applicationData
}

export const Component = {
    openDialog,
    openDialogAsync,
    openNotification,
}


export const Util = {
    idToPath,
    idToPathList,
    formatter,
    setAndJump,
    openComponent,
    asyncOpenComponent,
    useHandleClick,
}