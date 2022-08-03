import { getEnv } from '@utils';
import { rootApi } from '@redux/rootApi';
import { IChannel, ICreateChannelRequest, IDeleteChannelRequest, IGetMenyChannelsRequest, IGetOneChannelRequest, IUpdateChannelRequest } from '@backendTypes';



const { CUSTOM_API_V1_URL } = getEnv();

export const ChannelApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        createChannel: build.mutation<IChannel, ICreateChannelRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/channel/create',
                method: 'POST',
                body,
            }),
        }),
        getOneChannel: build.query<IChannel, IGetOneChannelRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/channel/getOne',
                method: 'POST',
                body,
            }),
        }),
        getMenyChannel: build.query<IChannel[], IGetMenyChannelsRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/channel/getMeny',
                method: 'POST',
                body,
            }),
        }),
        updateChannel: build.mutation<IChannel, IUpdateChannelRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/channel/update',
                method: 'POST',
                body,
            }),
        }),
        deleteChannel: build.mutation<IChannel, IDeleteChannelRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/channel/delete',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useCreateChannelMutation,
    useGetOneChannelQuery,
    useGetMenyChannelQuery,
    useUpdateChannelMutation,
    useDeleteChannelMutation,
} = ChannelApi;