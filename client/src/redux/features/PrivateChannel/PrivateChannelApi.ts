import { getEnv } from '@utils';
import { rootApi } from '@redux/rootApi';
import { IPrivateChannel, ICreatePrivateChannelRequest, ILeavePrivateChannelRequest, IGetManyPrivateChannelsRequest, IGetOnePrivateChannelRequest, IUpdatePrivateChannelRequest } from '@backendTypes';



const { CUSTOM_API_V1_URL } = getEnv();

export const PrivateChannelApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        createPrivateChannel: build.mutation<IPrivateChannel, ICreatePrivateChannelRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/private-channel/create',
                method: 'POST',
                body,
            }),
        }),
        getOnePrivateChannel: build.query<IPrivateChannel, IGetOnePrivateChannelRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/private-channel/getOne',
                method: 'POST',
                body,
            }),
        }),
        // getManyPrivateChannel: build.query<IPrivateChannel[], IGetManyPrivateChannelsRequest>({
        //     query: (body) => ({
        //         url: CUSTOM_API_V1_URL + '/private-channel/getMany',
        //         method: 'POST',
        //         body,
        //     }),
        // }),
        updatePrivateChannel: build.mutation<IPrivateChannel, IUpdatePrivateChannelRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/private-channel/update',
                method: 'POST',
                body,
            }),
        }),
        leavePrivateChannel: build.mutation<IPrivateChannel, ILeavePrivateChannelRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/private-channel/leave',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useCreatePrivateChannelMutation,
    useGetOnePrivateChannelQuery,
    // useGetManyPrivateChannelQuery,
    useUpdatePrivateChannelMutation,
    useLeavePrivateChannelMutation,
} = PrivateChannelApi;