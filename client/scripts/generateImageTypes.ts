import * as fs from 'fs';
import * as path from 'path';
import { compile } from 'json-schema-to-typescript';



const assetsPath = path.resolve(__dirname, '../src/assets');
const generatedTypesPath = path.resolve(__dirname, '../src/types/generated/index.ts');



const imageExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.bmp',
    '.svg', '.webp', '.ico', '.heic', '.avif',
];

const main = async() => {
    const fileNames: string[] = [];
    
    const traverseDirectory = (currentPath: string) => {
        const files = fs.readdirSync(currentPath);
      
        files.forEach((file) => {
            const filePath = path.join(currentPath, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) return traverseDirectory(filePath);
            if (!stat.isFile()) return;
            if (!imageExtensions.some((ext) => file.endsWith(ext))) return;

            fileNames.push(file);
        });          
    };
      
    traverseDirectory(assetsPath);

    fileNames.sort();

    await compile({
        title: 'ImageNames',
        enum: fileNames,
    }, 'images').then((ts) => {
        fs.writeFileSync(generatedTypesPath, ts);
    });
};

main().catch((error) => console.log(error));