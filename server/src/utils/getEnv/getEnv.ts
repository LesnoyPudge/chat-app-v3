import * as dotenv from 'dotenv';
import path from 'path';



interface IEnv {
    CUSTOM_NODE_ENV: 'development' | 'production';
    CUSTOM_SERVER_PORT: string;
    DB_CONNECTION: string;
    JWT_ACCESS_KEYWORD: string;
    JWT_REFRESH_KEYWORD: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_PASSWORD: string;
    CUSTOM_CLIENT_URL: string;
    CUSTOM_SERVER_URL: string;
    CUSTOM_API_V1_URL: string;
    BCRYPT_SALT_ROUNDS: number;
    REFRESH_TOKEN_DURATION: string;
    ACCESS_TOKEN_DURATION: string;
    ACCESS_CODE_DURATION: string;
    ACCESS_CODE_SIZE: number;
    ACCESS_CODE_ALPHABET: string;
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