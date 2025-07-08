
import { useHandleClick } from "@/utils/handleClick.ts";

import { openDialog,openDialogAsync } from "@/utils/component/Dialog.ts"
import { openMenu } from "@/utils/component/Menu.ts"
import { openNotification } from "@/utils/component/Notification.ts";
import { getFileIcon, getFileIconMap, setFileIconMap, clearFileIconMap, defaultFileIconMap } from '@/utils/iconMap.ts'
import { nodeData,sideTopData,sideBottomData } from "@/utils/iconData.ts";
import { formatter, idToPath,idToPathList  } from "@/utils/util.ts";

const Handle = {
    useHandleClick,
}

const Component = {
    openDialog,
    openDialogAsync,
    openNotification,
    openMenu
}

const IconMap = {
    getFileIcon,
    getFileIconMap,
    setFileIconMap,
    clearFileIconMap,
    defaultFileIconMap,
}

const IconData = {
    nodeData,
    sideTopData,
    sideBottomData
}

const Util = {
    idToPath,
    idToPathList,
    formatter
}



export {
    Handle,
    Component,
    IconMap,
    IconData,
    Util,
}