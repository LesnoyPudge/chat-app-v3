import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getEnv, getLocalStorage } from '../../utils';



const rootApi = createApi({
    baseQuery: fetchBaseQuery({ 
        baseUrl: getEnv().REACT_APP_SERVER_URL,
        prepareHeaders(headers) {
            headers.set('authorization', `Bearer ${getLocalStorage().values.token}`);
            return headers;
        },
        credentials: 'include',
    }),
    endpoints: () => ({}),
});

export default rootApi;