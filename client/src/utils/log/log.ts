import { getEnv } from '@utils';



export const log = (message?: unknown, ...optionalParams: unknown[]) => {
    if (getEnv().NODE_ENV === 'production') return;

    // eslint-disable-next-line no-console
    console.log(message, optionalParams);
};