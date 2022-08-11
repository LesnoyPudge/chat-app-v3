import { createTransport } from 'nodemailer';
import { getEnv } from '@utils';



const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = getEnv();

const transporter = createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
});

export const sendMail = {
    async sendActivationLink(to: string, link: string) {
        await transporter.sendMail({
            from: SMTP_PASSWORD,
            to,
            subject: 'Активация аккаунта в ChatApp',
            text: '',
            html: `
                <div>
                    <h1>Для активации перейдите по ссылке:</h1>

                    <a href="${link}">ссылка активации</a>
                </div>
            `,
        });
    },

    async sendAccessCode(to: string, code: string) {
        await transporter.sendMail({
            from: SMTP_USER,
            to,
            subject: 'Код доступа',
            text: '',
            html: `
                <div>
                    <h1>Ваш код доступа:</h1>

                    <span>${code}</span>
                </div>
            `,
        });
    },
};