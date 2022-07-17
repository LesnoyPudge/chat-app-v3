import * as dotenv from 'dotenv';
import path from 'path';



interface IEnv {
    NODE_ENV: 'development' | 'production';
    SERVER_PORT: string;
    DB_CONNECTION: string;
    JWT_ACCESS_KEYWORD: string;
    JWT_REFRESH_KEYWORD: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASSWORD: string;
    CLIENT_URL: string;
    SERVER_URL: string;
    API_V1_URL: string;
    BCRYPT_SALT_ROUNDS: string;
}

let init = false;

export const getEnv = () => {
    if (!init) {
        dotenv.config({ debug: true, path: path.join(__dirname, '../../../../.env') });
        init = true;
    }
    const vars = process.env as unknown as IEnv;

    return { ...vars };
};