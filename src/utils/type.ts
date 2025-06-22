export interface ElTreeNode {
    id: number;
    label: string;
    name: string;
    children?: ElTreeNode[];
    file_path?: string | null;
    file_size?: number | null;
    type: string;
    isLeaf: 0 | 1;
    marked?: 0 | 1;
    associated_folder: number | null;
    connected_workspace: number;
    uniqueKey?: string;
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