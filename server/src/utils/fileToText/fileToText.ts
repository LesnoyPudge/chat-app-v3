import { readFileSync } from 'fs';



export const fileToText = ({ pathToFile, vars }: { pathToFile: string, vars?: Record<string, string>}) => {
    let result = readFileSync(pathToFile).toString().trim();
    
    if (vars) {
        result = replaceVars({ text: result, vars });
    }

    return result;
};

const replaceVars = ({ text, vars = {} }: {text: string, vars?: Record<string, string>}) => {
    // ${variable}
    const varRegExp = /\$\{[a-z0-9_]+\}/igm;
    const varsToReplace = [...text.matchAll(varRegExp)].map((matchAllArrayItem) => {
        return matchAllArrayItem[0];
    });

    varsToReplace.forEach((stringToReplace) => {
        const onlyNameReqExp = /[^a-z0-9_]/igm;
        // ${variable} -> variable
        const varName = stringToReplace.replace(onlyNameReqExp, '');
        text = text.replace(stringToReplace, vars[varName] || '');
    });

    return text;
};