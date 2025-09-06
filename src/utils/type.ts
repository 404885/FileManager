export interface ElTreeNode {
    id: number;
    label: string;
    name: string;
    children?: ElTreeNode[];
    file_path?: string | null;
    file_size?: number | null;
    type: string;
    isLeaf: 0 | 1;
    marked?: 0 | 1 | boolean;
    associated_folder: number | null;
    connected_workspace: number;
    create_time?: number,
    last_browse_time?: number,
    uniqueKey?: string,
}

export interface FileNode {
    name: string
    path: string
    size?: number
    type?:string
    birthtime?: Date
    atime?: Date
    mtime?: Date
    children?: FileNode[] // 递归类型，表示目录结构
}

export interface VXETableNode {
    id: number;
    name: string;
    file_path?: string | null;
    file_size?: number | null;
    type: string;
    associated_folder: number | null;
    connected_workspace: number;
    create_time: number,
    last_browse_time?: number,
    tag?:string,
    description?: string,
}

export interface DraggableContainer {
    id: string;
    x:number;
    y:number;
    width:number;
    height:number;
}

export interface ContextMenuRow {
    name:string;
    icon?:string;
    click:Function;
}

export interface Applications{
    id:string,
    name:string,
    icon:string,
    dblclick?:Function,
    contextMenu?: (e: MouseEvent) => void;
}

export interface WallPaper{
    name:string,
    size:number,
    path:string,
    type:string,
    style?:string,
    tag?:string,
    description?: string,
}

export interface cellProps {
    dialogVisible: boolean
    rect: DOMRect
    data: any
    id: string
}

export interface Tag {
    name: string;
    connected_workspace: number;
    class: string;
}