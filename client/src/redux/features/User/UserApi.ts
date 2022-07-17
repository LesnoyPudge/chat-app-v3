import { getEnv } from '../../../utils';
import rootApi from '../../store/rootApi';



const { REACT_APP_API_V1_URL } = getEnv();

const UserApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        userRefresh: build.mutation({
            query: () => ({
                url: REACT_APP_API_V1_URL + '/user/refresh',
            }),
        }),
        userLogin: build.mutation({
            query: (body) => ({
                url: REACT_APP_API_V1_URL + '/user/login',
                method: 'POST',
                body,
            }),
        }),
        userLogout: build.mutation({
            query: () => ({
                url: REACT_APP_API_V1_URL + '/user/logout',
            }),
        }),
        userRegistration: build.mutation({
            query: (body) => ({
                url: REACT_APP_API_V1_URL + '/user/registration',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export default UserApi;

export const { 
    useUserRefreshMutation,
    useUserLogoutMutation,
    useUserLoginMutation,
    useUserRegistrationMutation,
    
} = UserApi;