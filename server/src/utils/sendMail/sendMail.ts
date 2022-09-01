import { createTransport } from 'nodemailer';
import { getEnv } from '@utils';
import { ActivationLinkEmail } from '@emails';
import { IUser } from '@types';



const {
    SMTP_SERVICE,
    SMTP_USER, 
    SMTP_PASSWORD,
    CUSTOM_SERVER_URL,
    CUSTOM_API_V1_URL,
} = getEnv();

const transporter = createTransport({
    service: SMTP_SERVICE,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
});

interface ISendActivationLinkArgs {
    username: string, 
    activationCode: string, 
    email: string
}

interface ISendAccessCodeArgs {
    to: string, 
    code: string
}

export const sendMail = {
    async sendActivationLink({ username, activationCode, email }: ISendActivationLinkArgs) {
        const link = CUSTOM_SERVER_URL + CUSTOM_API_V1_URL + `/users/activate/${activationCode}`;
        const emailName = 'Активация аккаунта в ChatApp';
        const html = ActivationLinkEmail({ emailName, username, link });

        await transporter.sendMail({
            from: SMTP_USER,
            to: email,
            subject: emailName,
            text: 'text field',
            html,
        }).then(() => {
            console.log('Письмо успешно отправлено');
        }).catch((error) => {
            console.log('Не удалось отправить письмо', error.message);
        });
    },

    async sendAccessCode({ to, code }: ISendAccessCodeArgs) {
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
        }).then(() => {
            console.log('Письмо успешно отправлено');
        }).catch((error) => {
            console.log('Не удалось отправить код доступа', error.message);
        });
    },
};