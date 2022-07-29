import { getEnv } from '@utils';



export const log = (...args: any) => {
    if (getEnv().CUSTOM_NODE_ENV === 'production') return;

    // eslint-disable-next-line no-console
    console.log(...args);
};