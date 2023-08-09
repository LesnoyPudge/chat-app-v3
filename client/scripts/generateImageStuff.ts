import '@total-typescript/ts-reset';
import * as fs from 'fs';
import * as path from 'path';
import { AnyArray } from 'ts-essentials';
import { optimize } from 'svgo';



export interface File {
    name: string;
    data: Buffer;
}

export interface Folder<FNAME = string> {
    name: FNAME;
    files: File[];
    folders: Folder[];
}

const dirs = {
    images: {
        source: path.resolve(__dirname, '../images'),
        assets: path.resolve(__dirname, '../src/assets/generatedImages'),
    },
    generated: path.resolve(__dirname, '../src/generated'),
    vars: path.resolve(__dirname, '../src/generated/vars'),
    types: path.resolve(__dirname, '../src/generated/types'),
} as const;

const vars = {
    imageExtensions: [
        'jpg', 'jpeg', 'png', 'gif', 'bmp',
        'svg', 'webp', 'ico', 'heic', 'avif',
    ],
    indexFile: 'index.ts',
} as const;

const utils = {
    getFolderTree: (currentPath: string, extensions?: AnyArray<string>): Folder => {
        const tree: Folder = { files: [], folders: [], name: '' };

        const fillFolder = (
            currentPath: string,
            folder: Folder,
        ) => {
            const files = fs.readdirSync(currentPath);
            const imageNames = new Set<string>();

            files.forEach((fileName) => {
                if (imageNames.has(fileName)) throw new Error(`Дубликат: ${fileName}`);

                imageNames.add(fileName);

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
    },

    toUpperSnake: (word: string) => {
        return word.toUpperCase().split('-').join('_');
    },

    generateIndexExports: (folderPath: string) => {
        const filePath = path.join(folderPath, vars.indexFile);

        fs.rmSync(filePath);

        const files = fs.readdirSync(folderPath);
        const importsArray: string[] = [];

        files.forEach((fileName) => {
            importsArray.push(`export * from './${fileName}'`);
        });

        const imports = importsArray.join('\n');
        fs.writeFileSync(filePath, imports);
    },

    getNameParts: (fileName: string) => {
        const splittedName = fileName.split('.');
        if (splittedName.length < 2) throw new Error('Имя без расширения');

        const ext = splittedName.pop();
        const name = utils.toUpperSnake(splittedName.join('.'));

        return {
            name,
            ext,
        };
    },

    replaceAll: (input: string, search: string, replace: string) => {
        return input.split(search).join(replace);
    },
};

const scripts = {
    generateOptimizedImages: () => {
        const tree = utils.getFolderTree(dirs.images.source, vars.imageExtensions);

        fs.rmSync(dirs.images.assets, { recursive: true, force: true });
        fs.mkdirSync(dirs.images.assets);

        const optimizeTree = (tree: Folder, currentPath: string) => {
            if (tree.name) fs.mkdirSync(currentPath);

            tree.files.forEach((file) => {
                const { ext, name } = utils.getNameParts(file.name);

                if (!vars.imageExtensions.includes(ext)) return;

                if (ext === 'svg') {
                    const optimized = optimize(file.data.toString(), {
                        multipass: true,
                        floatPrecision: 1,
                        plugins: [{ name: 'cleanupIds', params: { minify: false } }],
                    });

                    fs.writeFileSync(path.join(currentPath, `${utils.toUpperSnake(name)}.${ext}`), optimized.data);

                    return;
                }

                fs.writeFileSync(path.join(currentPath, `${utils.toUpperSnake(name)}.${ext}`), file.data);
            });

            tree.folders.forEach((folder) => {
                optimizeTree(folder, path.join(currentPath, folder.name));
            });
        };

        optimizeTree(tree, dirs.images.assets);
    },

    generateVarsFromImages: () => {
        const spriteArray: string[] = [];
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

        const tree = utils.getFolderTree(dirs.images.assets, vars.imageExtensions);

        const fillObject = (folder: Folder, pathToFolder: string) => {
            folder.files.forEach((file) => {
                const { ext, name } = utils.getNameParts(file.name);
                const splittedPath = path.join(pathToFolder, file.name).split('client');

                splittedPath.shift();

                const imagePath = splittedPath.join('client');

                const isSprite = folder.name === 'sprite';
                if (isSprite) {
                    const data = (
                        file.data.toString()
                            .replace('<svg', `<svg id="${name}"`)
                            // .replace('</svg>', '</symbol>')
                    );

                    spriteArray.push(data);
                }

                const section: keyof typeof imageObject = (
                    isSprite
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

        fillObject(tree, dirs.images.assets);

        const generatedText = [
            `// GENERATED IN ${__filename}`,
            `export const IMAGES = ${JSON.stringify(imageObject)} as const;`,
            'export const SPRITE = `' + spriteArray.join(' \n') + '`;',
        ].join('\n\n');

        fs.mkdirSync(dirs.vars, { recursive: true });
        fs.writeFileSync(path.join(dirs.vars, vars.indexFile), generatedText);

        utils.generateIndexExports(dirs.generated);
    },
} satisfies Record<string, () => void>;

const main = async() => {
    scripts.generateOptimizedImages();
    scripts.generateVarsFromImages();
};

main().catch((e) => {
    console.log(e);
});