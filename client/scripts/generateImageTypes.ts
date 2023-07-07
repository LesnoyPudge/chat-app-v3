import * as fs from 'fs';
import * as path from 'path';
import { compile } from 'json-schema-to-typescript';
import { Folder, getFolderTree, imageExtensions } from './shared';



const assetsPath = path.resolve(__dirname, '../src/assets');
const generatedTypesPath = path.resolve(__dirname, '../src/generated/types/imageNames.ts');

const main = async() => {
    const fileNames: string[] = [];
    
    const tree = getFolderTree(assetsPath, imageExtensions);

    const setFilenames = (folder: Folder) => {
        fileNames.push(...folder.files.map((file) => file.name));

        folder.folders.forEach((nextFolder) => {
            setFilenames(nextFolder);
        });
    };

    setFilenames(tree);

    fileNames.sort();
    
    await compile({
        title: 'ImageNames',
        enum: fileNames,
    }, 'images').then((ts) => {
        fs.writeFileSync(generatedTypesPath, ts);
    });
};

main().catch((error) => console.log(error));