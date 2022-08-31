import { getEnv } from '@utils';
import { rootApi } from '@redux/rootApi';
import { ICreateRoomRequest, IDeleteRoomRequest, IGetManyRoomsRequest, IGetOneRoomRequest, IRoom, IUpdateRoomRequest } from '@backendTypes';



const { CUSTOM_API_V1_URL } = getEnv();

export const RoomApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        createRoom: build.mutation<IRoom, ICreateRoomRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/room/create',
                method: 'POST',
                body,
            }),
        }),
        getOneRoom: build.query<IRoom, IGetOneRoomRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/room/getOne',
                method: 'POST',
                body,
            }),
        }),
        // getManyRoom: build.query<IRoom[], IGetManyRoomsRequest>({
        //     query: (body) => ({
        //         url: CUSTOM_API_V1_URL + '/room/getMany',
        //         method: 'POST',
        //         body,
        //     }),
        // }),
        updateRoom: build.mutation<IRoom, IUpdateRoomRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/room/update',
                method: 'POST',
                body,
            }),
        }),
        deleteRoom: build.mutation<IRoom, IDeleteRoomRequest>({
            query: (body) => ({
                url: CUSTOM_API_V1_URL + '/room/delete',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { 
    useCreateRoomMutation,
    useGetOneRoomQuery,
    // useGetManyRoomQuery,
    useUpdateRoomMutation,
    useDeleteRoomMutation,
} = RoomApi;