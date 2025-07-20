
import { useHandleClick } from "@/utils/handleClick.ts";

import { openDialog,openDialogAsync } from "@/utils/component/Dialog.ts"
import { openMenu } from "@/utils/component/Menu.ts"
import { openNotification } from "@/utils/component/Notification.ts";
import { getFileIcon, getFileIconMap, setFileIconMap, clearFileIconMap, defaultFileIconMap } from '@/utils/iconMap.ts'
import { nodeData,sideTopData,sideBottomData,headData } from "@/utils/Data.ts";
import { formatter,idToPath,idToPathList,setAndJump  } from "@/utils/util.ts";

export const Data = {
    nodeData,
    sideTopData,
    sideBottomData,
    headData
}

export const Handle = {
    useHandleClick,
}

export const Component = {
    openDialog,
    openDialogAsync,
    openNotification,
    openMenu
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
    setAndJump
}