import { getEnv } from '@utils';
import { rootApi } from '@redux/rootApi';
import { ICreateMessageRequest, IDeleteMessageRequest, IGetManyMessagesRequest, IGetOneMessageRequest, IMessage, IUpdateMessageRequest } from '@backendTypes';



const { CUSTOM_API_V1_URL } = getEnv();

export const MessageApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        createMessage: build.mutation<IMessage, ICreateMessageRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/message/create',
                method: 'POST',
                body,
            }),
        }),
        getOneMessage: build.query<IMessage, IGetOneMessageRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/message/getOne',
                method: 'POST',
                body,
            }),
        }),
        getManyMessage: build.query<IMessage[], IGetManyMessagesRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/message/getMany',
                method: 'POST',
                body,
            }),
        }),
        updateMessage: build.mutation<IMessage, IUpdateMessageRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/message/update',
                method: 'POST',
                body,
            }),
        }),
        deleteMessage: build.mutation<IMessage, IDeleteMessageRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/message/delete',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { 
    useCreateMessageMutation,
    useGetOneMessageQuery,
    useGetManyMessageQuery,
    useUpdateMessageMutation,
    useDeleteMessageMutation,
} = MessageApi;