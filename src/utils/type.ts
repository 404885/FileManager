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