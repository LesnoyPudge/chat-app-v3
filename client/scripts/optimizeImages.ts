import * as fs from 'fs';
import * as path from 'path';
import { optimize } from 'svgo';



const rawImagesPath = path.resolve(__dirname, '../src/rawImages');
const optimizedImagesPath = path.join(__dirname, '../src/assets/optimizedImages');
    
const imageExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.bmp',
    '.svg', '.webp', '.ico', '.heic', '.avif',
];

interface File {
    name: string;
    data: Buffer;
}

interface Folder {
    name: string;
    files: File[];
    folders: Folder[];
}

const main = async() => {
    const getFolderTree = (
        currentPath: string,
        tree: Folder = { files: [], folders: [], name: '' },
    ) => {
        const files = fs.readdirSync(currentPath);

        files.forEach((fileName) => {
            const filePath = path.join(currentPath, fileName);
            const stat = fs.statSync(filePath);
            const isImage = imageExtensions.some((ext) => fileName.endsWith(ext));

            if (stat.isFile() && isImage) {
                const fileData = fs.readFileSync(filePath);
                tree.files.push({ data: fileData, name: fileName });
            }

            if (stat.isDirectory()) {
                const folder: Folder = { name: fileName, files: [], folders: [] };
                tree.folders.push(folder);
                getFolderTree(filePath, folder);
            }
        });

        return tree;
    };

    const tree = getFolderTree(rawImagesPath);

    fs.rmSync(optimizedImagesPath, { recursive: true, force: true });
    fs.mkdirSync(optimizedImagesPath);

    const optimizeTree = (tree: Folder, currentPath: string) => {
        if (tree.name) fs.mkdirSync(currentPath);

        tree.files.forEach((file) => {
            const isImage = imageExtensions.some((ext) => file.name.endsWith(ext));
            if (!isImage) return;

            const isSvg = file.name.endsWith('.svg');
            if (isSvg) {
                const optimized = optimize(file.data.toString(), { 
                    multipass: true, 
                    floatPrecision: 1, 
                });
                fs.writeFileSync(path.join(currentPath, file.name), optimized.data);
                return;
            }           

            fs.writeFileSync(path.join(currentPath, file.name), file.data);
        });

        tree.folders.forEach((folder) => {
            optimizeTree(folder, path.join(currentPath, folder.name));
        });
    };
    
    optimizeTree(tree, optimizedImagesPath); 
};

main().catch((error) => console.log(error));