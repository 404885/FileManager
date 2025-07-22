import { openDialog,openDialogAsync } from "@/utils/component/Dialog.ts"
import { openMenu, openMenuAsync } from "@/utils/component/Menu.ts"
import { openNotification } from "@/utils/component/Notification.ts";


import { getFileIcon, getFileIconMap, setFileIconMap, clearFileIconMap, defaultFileIconMap } from '@/utils/iconMap.ts'
import { nodeData,sideTopData,sideBottomData,headData } from "@/utils/Data.ts";
import { formatter,idToPath,idToPathList,setAndJump,openComponent,asyncOpenComponent,useHandleClick  } from "@/utils/util.ts";

export const Data = {
    nodeData,
    sideTopData,
    sideBottomData,
    headData
}

export const Component = {
    openDialog,
    openDialogAsync,
    openNotification,
    openMenu,
    openMenuAsync
}

export const IconMap = {
    getFileIcon,
    getFileIconMap,
    setFileIconMap,
    clearFileIconMap,
    defaultFileIconMap,
}

export const IconData = {
    nodeData,
    sideTopData,
    sideBottomData
}

export const Util = {
    idToPath,
    idToPathList,
    formatter,
    setAndJump,
    openComponent,
    asyncOpenComponent,
    useHandleClick
}