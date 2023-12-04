import isUrlHttpLib from 'is-url-http';



export const isUrlHttp = (text: string): boolean => {
    return !text.includes(' ') && isUrlHttpLib(text);
};