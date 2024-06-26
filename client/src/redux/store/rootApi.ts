import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { getEnv, isDev, isProd } from '@utils';
import { Endpoints, HTTP_STATUS_CODES } from '@shared';
import { FetchBaseQueryMeta } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { CustomQueryError } from '@types';
import { triggerGlobalResetAction } from '@redux/globalReset';



const { CUSTOM_SERVER_URL } = getEnv();

const baseQuery = fetchBaseQuery({
    baseUrl: CUSTOM_SERVER_URL,
    credentials: 'include',
}) as BaseQueryFn<string | FetchArgs, unknown, CustomQueryError, {}, FetchBaseQueryMeta>;

const queryWithRetry = retry(async(...args: Parameters<typeof baseQuery>) => {
    const result = await baseQuery(...args);

    // if (isDev()) {
    //     await new Promise<void>((resolve) => {
    //         setTimeout(() => {
    //             resolve();
    //         }, 1400);
    //     });
    // }

    const shouldBail = (
        !!result.error &&
        (
            typeof result.error.status === 'number' &&
            result.error.status !== HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
        )
    );
    console.log('shouldBail', shouldBail);
    if (shouldBail) retry.fail(result.error);

    return result;
}, {
    maxRetries: isProd() ? 5 : 2,
});

const queryWithReAuth = async(...args: Parameters<typeof baseQuery>) => {
    const result = await queryWithRetry(...args);

    if (result.error?.status !== HTTP_STATUS_CODES.UNAUTHORIZED) {
        console.log(`error is not ${HTTP_STATUS_CODES.UNAUTHORIZED}:`, result.error?.status);
        return result;
    }

    const api = args[1];

    const refreshResponse = await queryWithRetry(
        Endpoints.V1.User.Refresh.Path,
        api,
        args[2],
    );
    console.log('after refresh', refreshResponse);
    if (!refreshResponse.error) return queryWithRetry(...args);
    console.log('reset');
    api.dispatch(triggerGlobalResetAction());


    return result;
};

export const rootApi = createApi({
    baseQuery: queryWithReAuth,
    endpoints: () => ({}),
});