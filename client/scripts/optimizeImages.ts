import * as fs from 'fs';
import * as path from 'path';
import { optimize } from 'svgo';
import { Folder, getFolderTree, imageExtensions } from './shared';



const rawImagesPath = path.resolve(__dirname, '../src/assets/rawImages');
const optimizedImagesPath = path.join(__dirname, '../src/assets/generatedImages');

const main = async() => {
    const tree = getFolderTree(rawImagesPath, imageExtensions);

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