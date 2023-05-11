declare global {
    namespace NodeJS {
      interface ProcessEnv {
        CUSTOM_NODE_ENV: 'development' | 'production';
        CUSTOM_SERVER_PORT: string;
        DB_CONNECTION_URL: string;
        JWT_ACCESS_KEYWORD: string;
        JWT_REFRESH_KEYWORD: string;
        SMTP_SERVICE: string;
        SMTP_USER: string;
        SMTP_PASSWORD: string;
        CUSTOM_CLIENT_URL: string;
        CUSTOM_SERVER_URL: string;
        CUSTOM_API_V1_URL: string;
        BCRYPT_SALT_ROUNDS: string;
        REFRESH_TOKEN_DURATION: string;
        ACCESS_TOKEN_DURATION: string;
        ACCESS_CODE_DURATION: string;
        ACCESS_CODE_SIZE: string;
      }
    }
}

export {};