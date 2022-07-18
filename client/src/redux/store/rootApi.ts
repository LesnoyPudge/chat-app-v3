import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError, retry } from '@reduxjs/toolkit/query/react';
import { IAuthResponse } from '../../../../server/src/types/common/API';
import { getEnv, getLocalStorage } from '../../utils';
import { logout } from '../features';




const baseQuery = fetchBaseQuery({ 
    baseUrl: getEnv().REACT_APP_SERVER_URL,
    prepareHeaders(headers) {
        headers.set('authorization', `Bearer ${getLocalStorage().values.token}`);
        return headers;
    },
    credentials: 'include',
});

const retryHandlingBaseQuery = retry(baseQuery, {
    maxRetries: 3,
});

const retryHandlingBaseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async(args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    console.log('selali zapros');
    if (result.error && result.error.status === 401) {
    // try to get a new token
        console.log('got unauth');
    
        const refreshResult = await baseQuery(
            getEnv().REACT_APP_API_V1_URL + '/user/refresh', 
            api, 
            extraOptions,
        );
        console.log('sdelali refresh: ', refreshResult);
        if (refreshResult.data) {
            console.log('got refresh token');
            const data = refreshResult.data as IAuthResponse;
            // store the new token
            getLocalStorage().set('token', data.accessToken);
            // retry the initial query
            result = await baseQuery(args, api, extraOptions);
        } else {
            console.log('dispatchim logout');
            api.dispatch(logout());
        }
    }
    return result;
};

const rootApi = createApi({
    baseQuery: retryHandlingBaseQueryWithReauth,
    endpoints: () => ({}),
});

export default rootApi;