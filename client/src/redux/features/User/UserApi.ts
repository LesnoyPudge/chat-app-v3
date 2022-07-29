import { IAuthResponse, IUserLoginReq, IUserRegistrationReq } from '@backendTypes';
import { getEnv } from '../../../utils';
import rootApi from '../../store/rootApi';



const { CUSTOM_API_V1_URL } = getEnv();

const UserApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        userRefresh: build.query<IAuthResponse, void>({
            query: () => ({
                url: CUSTOM_API_V1_URL + '/user/refresh',
            }),
        }),
        userLogin: build.mutation<IAuthResponse, IUserLoginReq>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/user/login',
                method: 'POST',
                body,
            }),
        }),
        userLogout: build.mutation<void, void>({
            query: () => ({
                url: CUSTOM_API_V1_URL + '/user/logout',
            }),
        }),
        userRegistration: build.mutation<IAuthResponse, IUserRegistrationReq>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/user/registration',
                method: 'POST',
                body,
            }),
        }),
        userSome: build.mutation<void, void>({
            query: () => ({
                url: CUSTOM_API_V1_URL + '/user/some',
            }),
        }),
        userUpdate: build.mutation<void, {username: string}>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/user/update',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export default UserApi;

export const { 
    useUserRefreshQuery,
    useUserLogoutMutation,
    useUserLoginMutation,
    useUserRegistrationMutation,
    useUserSomeMutation,
    useUserUpdateMutation,
    
} = UserApi;