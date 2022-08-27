import { getEnv } from '@utils';
import { rootApi } from '@redux/rootApi';
import { ICreateTextRoomRequest, IDeleteTextRoomRequest, IGetManyTextRoomsRequest, IGetOneTextRoomRequest, ITextRoom, IUpdateTextRoomRequest } from '@backendTypes';



const { CUSTOM_API_V1_URL } = getEnv();

export const TextRoomApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        createTextRoom: build.mutation<ITextRoom, ICreateTextRoomRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/text-room/create',
                method: 'POST',
                body,
            }),
        }),
        getOneTextRoom: build.query<ITextRoom, IGetOneTextRoomRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/text-room/getOne',
                method: 'POST',
                body,
            }),
        }),
        // getManyTextRoom: build.query<ITextRoom[], IGetManyTextRoomsRequest>({
        //     query: (body) => ({
        //         url: CUSTOM_API_V1_URL + '/text-room/getMany',
        //         method: 'POST',
        //         body,
        //     }),
        // }),
        updateTextRoom: build.mutation<ITextRoom, IUpdateTextRoomRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/text-room/update',
                method: 'POST',
                body,
            }),
        }),
        deleteTextRoom: build.mutation<ITextRoom, IDeleteTextRoomRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/text-room/delete',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { 
    useCreateTextRoomMutation,
    useGetOneTextRoomQuery,
    // useGetManyTextRoomQuery,
    useUpdateTextRoomMutation,
    useDeleteTextRoomMutation,
} = TextRoomApi;