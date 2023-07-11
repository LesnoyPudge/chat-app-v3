import { BaseQueryApi, QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError, FetchBaseQueryMeta, retry } from '@reduxjs/toolkit/query/react';
import { getEnv } from '@utils';
import { Endpoints } from '@shared';
import { store } from './store';
import { globalReset } from './globalReset';



const baseQuery = fetchBaseQuery({ 
    baseUrl: getEnv().CUSTOM_SERVER_URL,
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
    const result = await retryHandlingBaseQuery(args, api, extraOptions);

    // if (result.meta?.response && result.meta.response.status !== 401) return result;

    // const refreshResponse = await retryHandlingBaseQuery(
    //     Endpoints.V1.User.Refresh.Path, 
    //     api, 
    //     extraOptions,
    // );

    // if (refreshResponse.data) {
    //     const data = refreshResponse.data;
    //     // getLocalStorage().set('token', data.accessToken);
    //     console.log('rootApi:', data);
    //     result = await retryHandlingBaseQuery(args, api, extraOptions);
    //     return result;
    // }
    
    // await retryHandlingBaseQuery(
    //     Endpoints.V1.User.Refresh.Path, 
    //     api, 
    //     extraOptions,
    // );

    // console.log('rootApi: logout');
    // // store.dispatch(globalReset());
    // // api.dispatch(
    // //     logout()
    // // );

    return result;
};

export const rootApi = createApi({
    baseQuery: retryHandlingBaseQueryWithReauth,
    endpoints: () => ({}),
});