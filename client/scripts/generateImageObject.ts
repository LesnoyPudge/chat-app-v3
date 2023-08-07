import * as fs from 'fs';
import * as path from 'path';
import { Folder, getFolderTree, imageExtensions } from './shared';



// const generatedImagesPath = path.resolve(__dirname, '../src/assets/generatedImages');
// const generatedObjectPath = path.resolve(__dirname, '../src/generated/vars/imageObject.ts');

// const main = async() => {
//     const imageMap = new Map<string, {name: string, path: string}>();

//     const toCamelCase = (word: string) => {
//         const parts = word.split('-').map((part) => {
//             return part[0].toUpperCase() + part.slice(1);
//         });

//         return parts.join('');
//     };

//     const tree = getFolderTree(generatedImagesPath, imageExtensions);

//     const foo = (folder: Folder, pathToFolder: string) => {
//         folder.files.forEach((file) => {
//             imageMap.set(toCamelCase(file.name), {
//                 name: file.name,
//                 path: path.join(pathToFolder, file.name),
//             });
//         });

//         folder.folders.forEach((nextFolder) => {
//             foo(nextFolder, path.join(pathToFolder, nextFolder.name));
//         });
//     };

//     foo(tree, generatedImagesPath);

//     const objectFromMap = Object.fromEntries(imageMap.entries());

//     const replaceAll = (input: string, search: string, replace: string) => {
//         return input.split(search).join(replace);
//     };

//     const generatedTextObject = Object.keys(objectFromMap).map((key) => {
//         const notLocalPath = objectFromMap[key].path.split('client\\')[1];

//         return `${String(key).split('.')[0]}: {
//             name: '${objectFromMap[key].name}',
//             path: '${replaceAll(notLocalPath, '\\', '\\\\')}',
//         }`;
//     }).join(',\n');

//     const generatedText = [
//         `// GENERATED IN ${__filename}`,
//         'export const IMAGES = {',
//         `    ${generatedTextObject}`,
//         '} as const;',
//     ].join('\n');

//     fs.writeFileSync(generatedObjectPath, generatedText);
// };

// main().catch((error) => console.log(error));








const sourceImagePath = path.resolve(__dirname, '../images');
const assetsPath = path.resolve(__dirname, '../src/assets/GENERATED');
const generatedObjectPath = path.resolve(__dirname, '../src/generated/vars/imageObject.ts');

const main = async() => {
    // const imageMap = new Map<string, {name: string, ext: string, path: string}>();
    const imageNames = new Set<string>();
    const imageObject: Record<
        'COMMON' | 'SPRITE',
        Record<
            string,
            {NAME: string, EXT: string, PATH: string}
        >
    > = {
        COMMON: {},
        SPRITE: {},
    };

    const toUpperSnake = (word: string) => {
        return word.toUpperCase().split('-').join('_');
    };

    const tree = getFolderTree(sourceImagePath, imageExtensions);

    const fillObject = (folder: Folder, pathToFolder: string) => {
        folder.files.forEach((file) => {
            const splittedName = file.name.split('.');
            if (splittedName.length < 2) throw new Error('Имя без расширения');

            const ext = splittedName.pop();
            const name = toUpperSnake(splittedName.join('.'));
            const splittedPath = path.join(pathToFolder, file.name).split('client\\');

            splittedPath.shift();

            const imagePath = splittedPath.join('client\\');

            if (imageNames.has(name)) throw new Error(`Дубликат: ${name}`);

            imageNames.add(name);

            const section: keyof typeof imageObject = (
                folder.name === 'sprite'
                    ? 'SPRITE'
                    : 'COMMON'
            );

            imageObject[section][name] = {
                EXT: ext,
                NAME: name,
                PATH: imagePath,
            };
        });

        folder.folders.forEach((nextFolder) => {
            fillObject(nextFolder, path.join(pathToFolder, nextFolder.name));
        });
    };

    fillObject(tree, assetsPath);

    const generatedText = `
        // GENERATED IN ${__filename}

        export const IMAGES = ${JSON.stringify(imageObject)} as const;
    `;

    fs.writeFileSync(generatedObjectPath, generatedText);
};

main().catch((error) => console.log(error));