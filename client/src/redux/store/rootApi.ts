import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';



const rootApi = createApi({
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:5000/api',
        prepareHeaders(headers) {
            headers.set('authorization', `Bearer ${localStorage.getItem('token')}`);
            return headers;
        },
        credentials: 'include',
    }),
    endpoints: () => ({}),
});

export default rootApi;