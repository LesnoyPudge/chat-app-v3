


interface IEnv {
    CUSTOM_NODE_ENV: 'development' | 'production';
    CUSTOM_WS_SERVER: string;
    CUSTOM_SERVER_URL: string;
    CUSTOM_API_V1_URL: string;
}

export const getEnv = () => {
    const vars: IEnv = import.meta.env as unknown as IEnv;

    return {
        ...vars,
    };
};