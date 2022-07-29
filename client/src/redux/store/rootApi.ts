import { BaseQueryApi, QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError, FetchBaseQueryMeta, retry } from '@reduxjs/toolkit/query/react';
import { IAuthResponse } from '@backendTypes';
import { getEnv, getLocalStorage } from '../../utils';
import { logout } from '../features';



const baseQuery = fetchBaseQuery({ 
    baseUrl: getEnv().CUSTOM_SERVER_URL,
    prepareHeaders(headers) {
        headers.set('authorization', `Bearer ${getLocalStorage().values.token}`);
        return headers;
    },
    credentials: 'include',
});

const retryHandlingBaseQuery = async(
    args: string | FetchArgs, 
    api: BaseQueryApi, 
    extraOptions: Record<string, unknown>,
) => {
    const basicRetry = retry(
        async() => {
            const result = await baseQuery(
                args,
                api,
                extraOptions,
            );
        
            if (result.meta?.response && result.meta.response.status !== 500) {
                retry.fail(result);
            }
        
            return result;
        },
        {
            maxRetries: 3,
        },
    );

    const response = await basicRetry(args, api, extraOptions as never);
    if (response?.meta) return response;

    const normalizedResponse = response.error as QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>;
    return normalizedResponse;
};

const retryHandlingBaseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async(args, api, extraOptions) => {
    let result = await retryHandlingBaseQuery(args, api, extraOptions);

    if (result.meta?.response && result.meta.response.status !== 401) return result;

    const refreshResponse = await retryHandlingBaseQuery(
        getEnv().CUSTOM_API_V1_URL + '/user/refresh', 
        api, 
        extraOptions,
    );

    if (refreshResponse.data) {
        const data = refreshResponse.data as IAuthResponse;
        getLocalStorage().set('token', data.accessToken);
        result = await retryHandlingBaseQuery(args, api, extraOptions);
    } else {
        retryHandlingBaseQuery(
            getEnv().CUSTOM_API_V1_URL + '/user/logout', 
            api, 
            extraOptions,
        );
        api.dispatch(logout());
    }

    return result;
};

const rootApi = createApi({
    baseQuery: retryHandlingBaseQueryWithReauth,
    endpoints: () => ({}),
});

export default rootApi;