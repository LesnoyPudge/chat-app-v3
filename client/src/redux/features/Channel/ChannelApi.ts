import { getEnv } from '@utils';
import { rootApi } from '@redux/rootApi';



const { CUSTOM_API_V1_URL } = getEnv();

export const ChannelApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        createChannel: build.query<any, void>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/channel/create',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useCreateChannelQuery,
} = ChannelApi;