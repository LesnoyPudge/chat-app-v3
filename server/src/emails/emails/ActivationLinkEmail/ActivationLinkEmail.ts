import path from 'path';
import { Document } from '@emails/components';
import { fileToText } from '@utils';



interface IActivationLinkEmail {
    emailName: string;
    username: string;
    link: string;
}

export const ActivationLinkEmail = ({ emailName, username, link }: IActivationLinkEmail) => {
    const pathToHTML = path.join(__dirname, '/ActivationLinkEmail.html');
    const pathToCSS = path.join(__dirname, '/ActivationLinkEmail.css');

    const css = fileToText({ pathToFile: pathToCSS });
    const html = fileToText({ 
        pathToFile: pathToHTML,
        vars: {
            username,
            link,
        }, 
    });

    const document = Document({
        STYLE_SHEET: css,
        CONTENT: html,
        emailName,
        preheader: 'Активируйте свой аккаунт',
    });

    return document;
};