import rootApi from 'src/redux/store/rootApi';
import { IChannel } from '@backendTypes';




const ChannelApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        createChannel: build.mutation<IChannel, {name: string, identifier: string}>({
            query: (body) => ({
                url: '/channel/create',
                method: 'POST',
                body,
            }),
        }),

        updateChannel: build.mutation<IChannel, {name: string}>({
            query: (body) => ({
                url: '/channel/update',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export default ChannelApi;

export const { 
    useCreateChannelMutation,
    useUpdateChannelMutation,
    
} = ChannelApi;