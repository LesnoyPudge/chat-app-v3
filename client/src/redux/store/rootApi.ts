import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { getEnv } from '@utils';
import { Endpoints, HTTP_STATUS_CODES } from '@shared';
import { globalReset } from './globalReset';



const { CUSTOM_NODE_ENV } = getEnv();
const maxRetries = CUSTOM_NODE_ENV === 'production' ? 5 : 2;

const baseQuery = fetchBaseQuery({
    baseUrl: getEnv().CUSTOM_SERVER_URL,
    credentials: 'include',
});

const retryHandlingQuery = retry(async(...args) => {
    const result = await baseQuery(...args);

    const shouldRetry = (
        result.meta?.response
            ? result.meta.response.status === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
            : true
    );

    if (!shouldRetry) retry.fail(result.error);

    return result;
}, { maxRetries });

const reAuthHandlingQuery = async(...args: Parameters<typeof baseQuery>) => {
    const result = await retryHandlingQuery(...args);

    if (result.meta?.response?.status !== HTTP_STATUS_CODES.UNAUTHORIZED) {
        return result;
    }

    const refreshResponse = await retryHandlingQuery(
        Endpoints.V1.User.Refresh,
        args[1],
        args[2],
    );

    if (!refreshResponse.error) return retryHandlingQuery(...args);

    const api = args[1];
    api.dispatch(globalReset);

    return result;
};

export const rootApi = createApi({
    baseQuery: reAuthHandlingQuery,
    endpoints: () => ({}),
});