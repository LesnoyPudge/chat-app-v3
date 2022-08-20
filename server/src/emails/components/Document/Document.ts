import path from 'path';
import { fileToText } from '@utils';



interface IDocumentArgs {
    STYLE_SHEET: string;
    CONTENT: string;
    emailName: string;
    preheader: string;
}

export const Document = ({ STYLE_SHEET, CONTENT, emailName, preheader }: IDocumentArgs) => {
    const pathToFile = path.join(__dirname, '/Document.html');
    const document = fileToText({ 
        pathToFile, 
        vars: {
            STYLE_SHEET,
            CONTENT,
            emailName,
            preheader,
        }, 
    });

    return document;
};