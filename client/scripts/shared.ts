import * as fs from 'fs';
import * as path from 'path';
import { AnyArray } from 'ts-essentials';



export interface File {
    name: string;
    data: Buffer;
}

export interface Folder {
    name: string;
    files: File[];
    folders: Folder[];
}

export const getFolderTree = (
    currentPath: string,
    extensions?: AnyArray,
): Folder => {
    const tree: Folder = { files: [], folders: [], name: '' };
    
    const fillFolder = (
        currentPath: string,
        folder: Folder,
    ) => {
        const files = fs.readdirSync(currentPath);

        files.forEach((fileName) => {
            const filePath = path.join(currentPath, fileName);
            const stat = fs.statSync(filePath);

            const validExtension = (
                extensions 
                    ? extensions.some((ext) => fileName.endsWith(ext)) 
                    : true
            );
    
            if (stat.isFile() && validExtension) {
                const fileData = fs.readFileSync(filePath);
                folder.files.push({ data: fileData, name: fileName });
            }
    
            if (stat.isDirectory()) {
                const newFolder: Folder = { name: fileName, files: [], folders: [] };
                folder.folders.push(newFolder);
                fillFolder(filePath, newFolder);
            }
        });
    };

    fillFolder(currentPath, tree);

    return tree;
};

export const imageExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.bmp',
    '.svg', '.webp', '.ico', '.heic', '.avif',
] as const;