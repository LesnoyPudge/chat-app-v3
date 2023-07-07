import * as fs from 'fs';
import * as path from 'path';
import { Folder, getFolderTree, imageExtensions } from './shared';



const generatedImagesPath = path.resolve(__dirname, '../src/assets/generatedImages');
const generatedObjectPath = path.resolve(__dirname, '../src/generated/vars/imageObject.ts');

const main = async() => {
    const imageMap = new Map<string, {name: string, path: string}>();

    const toCamelCase = (word: string) => {
        const parts = word.split('-').map((part) => {
            return part[0].toUpperCase() + part.slice(1);
        });

        return parts.join('');
    };

    const tree = getFolderTree(generatedImagesPath, imageExtensions);

    const foo = (folder: Folder, pathToFolder: string) => {
        folder.files.forEach((file) => {
            imageMap.set(toCamelCase(file.name), {
                name: file.name,
                path: path.join(pathToFolder, file.name),
            });
        });

        folder.folders.forEach((nextFolder) => {
            foo(nextFolder, path.join(pathToFolder, nextFolder.name));
        });
    };

    foo(tree, generatedImagesPath);

    const objectFromMap = Object.fromEntries(imageMap.entries());

    const replaceAll = (input: string, search: string, replace: string) => {
        return input.split(search).join(replace);
    };

    const generatedTextObject = Object.keys(objectFromMap).map((key) => {
        const notLocalPath = objectFromMap[key].path.split('client\\')[1];

        return `${String(key).split('.')[0]}: {
            name: '${objectFromMap[key].name}',
            path: '${replaceAll(notLocalPath, '\\', '\\\\')}',
        }`;
    }).join(',\n');

    const generatedText = [
        '// GENERATED IN ${__filename}',
        'export const IMAGES = {',
        `    ${generatedTextObject}`,
        '} as const;',
    ].join('\n');

    fs.writeFileSync(generatedObjectPath, generatedText);
};

main().catch((error) => console.log(error));