import { createTransport } from 'nodemailer';
import { getEnv } from '@utils';
import { readFileSync } from 'fs';
import path from 'path';





const {
    SMTP_SERVICE,
    SMTP_USER, 
    SMTP_PASSWORD,
    CUSTOM_CLIENT_URL,
} = getEnv();

const transporter = createTransport({
    service: SMTP_SERVICE,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
});

const accessCodeHTML = readFileSync(path.join(
    __dirname, 
    '/accessCode.html',
)).toString();

export const emails = {
    async sendAccessCode({ code, email }: { email: string; code: string; }) {
        const vars: Record<string, string> = {
            code,
            homepageLink: CUSTOM_CLIENT_URL,
        };
        
        let modifiedHTML = accessCodeHTML;
        // ${variable}
        const varRegExp = /\$\{[a-z0-9_]+\}/igm;
        const varsToReplace = [...modifiedHTML.matchAll(varRegExp)].map((item) => {
            return item[0];
        });

        varsToReplace.forEach((stringToReplace) => {
            const onlyNameRegExp = /[^a-z0-9_]/igm;
            // ${variable} -> variable
            const varName = stringToReplace.replace(onlyNameRegExp, '');
            modifiedHTML = modifiedHTML.replace(stringToReplace, vars[varName] || '');
        });

        await transporter.sendMail({
            from: SMTP_USER,
            to: email,
            subject: 'Код доступа',
            text: `Ваш код доступа: ${code}`,
            html: modifiedHTML,
        });
    },
};