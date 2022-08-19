import { createTransport } from 'nodemailer';
import { getEnv } from '@utils';



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

export const sendMail = {
    async sendActivationLink({ to, activationCode }: {to: string, activationCode: string}) {
        const link = CUSTOM_SERVER_URL + CUSTOM_API_V1_URL + `/user/activate-account/${activationCode}`;

        await transporter.sendMail({
            from: SMTP_USER,
            to,
            subject: 'Активация аккаунта в ChatApp',
            text: '',
            html: `
            <!DOCTYPE html>
<html lang="en" dir="ltr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1 user-scalable=yes">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Email title</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
  </style>
</head>
<body class="body">
  <div role="article" aria-roledescription="email" aria-label="email name" lang="en" dir="ltr" style="font-size:medium; font-size:max(16px, 1rem)">
  <div>
  <h1>Для активации аккаунта перейдите по ссылке:</h1>

  <a href="${link}">ссылка активации</a>
</div>
  </div>
</body>
</html>
                
            `,
        }).then(() => {
            console.log('Письмо успешно отправлено');
        });
    },

    async sendAccessCode({ to, code }: {to: string, code: string}) {
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