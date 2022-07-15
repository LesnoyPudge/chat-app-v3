


interface IEnv {
    NODE_ENV: 'development' | 'production';
    PUBLIC_URL: string;
    REACT_APP_WS_SERVER: string;
}

export const getEnv = () => {
    const vars = process.env as unknown as IEnv;

    return {
        ...vars,
    };
};