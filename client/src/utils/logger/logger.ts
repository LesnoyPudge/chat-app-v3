import { isProd } from '@utils';



export const logger = {
    ...Object.keys(console).reduce((acc, cur) => {
        acc[cur] = (...data) => {
            if (isProd()) return;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line no-console
            console[cur](...data);
        };

        return acc;
    }, {} as Console),

    prod: console,
};