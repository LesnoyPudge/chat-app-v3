import { rootApi } from '@redux/rootApi';
import { Endpoints } from '@shared';



export const RoomApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        [Endpoints.V1.Room.Create.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Room.Create.Response,
            Endpoints.V1.Room.Create.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Room.Create.Path,
                method: Endpoints.V1.Room.Create.Method,
                body,
            }),
        }),
        [Endpoints.V1.Room.Delete.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Room.Delete.Response,
            Endpoints.V1.Room.Delete.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Room.Delete.Path,
                method: Endpoints.V1.Room.Delete.Method,
                body,
            }),
        }),
        [Endpoints.V1.Room.GetOne.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Room.GetOne.Response,
            Endpoints.V1.Room.GetOne.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Room.GetOne.Path,
                method: Endpoints.V1.Room.GetOne.Method,
                body,
            }),
        }),
        [Endpoints.V1.Room.Update.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Room.Update.Response,
            Endpoints.V1.Room.Update.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Room.Update.Path,
                method: Endpoints.V1.Room.Update.Method,
                body,
            }),
        }),
    }),
    overrideExisting: false,
});