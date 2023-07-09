import { getEnv } from '@utils';



const { CUSTOM_NODE_ENV } = getEnv();

export const log = (...args: unknown[]) => {
    if (CUSTOM_NODE_ENV === 'production') return;

    // eslint-disable-next-line no-console
    console.log(...args);
};