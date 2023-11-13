import { isProd } from '@utils';



export const log = (...args: unknown[]) => {
    if (isProd()) return;

    // eslint-disable-next-line no-console
    console.log(...args);
};

export const logger = {
    ...Object.keys(console).reduce((acc, cur) => {
        acc[cur] = (...data) => {
            if (isProd()) return;
            // @ts-ignore
            console[cur](...data);
        };

        return acc;
    }, {} as Console),

    prod: console,
};