import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { getEnv } from '@utils';
import { Endpoints, HTTP_STATUS_CODES } from '@shared';
import { globalReset } from './globalReset';
import { FetchBaseQueryMeta } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { CustomQueryError } from '@types';



const { CUSTOM_NODE_ENV } = getEnv();
const maxRetries = CUSTOM_NODE_ENV === 'production' ? 5 : 2;

const baseQuery = fetchBaseQuery({
    baseUrl: getEnv().CUSTOM_SERVER_URL,
    credentials: 'include',
}) as BaseQueryFn<string | FetchArgs, unknown, CustomQueryError, {}, FetchBaseQueryMeta>;

const queryWithRetry = retry(async(...args: Parameters<typeof baseQuery>) => {
    const result = await baseQuery(...args);

    const shouldBail = (
        !!result.error &&
        (
            typeof result.error.status === 'number' &&
            result.error.status !== HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
        )
    );

    if (shouldBail) retry.fail(result.error);

    return result;
}, { maxRetries });

const queryWithReAuth = async(...args: Parameters<typeof baseQuery>) => {
    const result = await queryWithRetry(...args);

    if (result.meta?.response?.status !== HTTP_STATUS_CODES.UNAUTHORIZED) {
        return result;
    }

    const refreshResponse = await queryWithRetry(
        Endpoints.V1.User.Refresh.Path,
        args[1],
        args[2],
    );

    if (!refreshResponse.error) return queryWithRetry(...args);

    const api = args[1];
    api.dispatch(globalReset);

    return result;
};

export const rootApi = createApi({
    baseQuery: queryWithReAuth,
    endpoints: () => ({}),
});