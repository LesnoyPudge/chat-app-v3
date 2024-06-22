export interface ClientAccessibleEnv {
    readonly CUSTOM_NODE_ENV: 'development' | 'production';
    readonly CUSTOM_SERVER_PORT: string;
    readonly CUSTOM_CLIENT_URL: string;
    readonly CUSTOM_SERVER_URL: string;
    readonly CUSTOM_API_V1_URL: '/api/v1';
    readonly CUSTOM_CLIENT_ONLY: '0' | '1';
}

export interface Env extends ClientAccessibleEnv {
    readonly DB_CONNECTION_URL: string;
    readonly JWT_ACCESS_KEYWORD: string;
    readonly JWT_REFRESH_KEYWORD: string;
    readonly SMTP_SERVICE: string;
    readonly SMTP_USER: string;
    readonly SMTP_PASSWORD: string;
    readonly BCRYPT_SALT_ROUNDS: string;
    readonly REFRESH_TOKEN_DURATION: string;
    readonly ACCESS_TOKEN_DURATION: string;
    readonly ACCESS_CODE_DURATION: string;
    readonly ACCESS_CODE_SIZE: string;
}