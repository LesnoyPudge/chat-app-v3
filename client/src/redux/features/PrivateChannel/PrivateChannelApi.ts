import { rootApi } from '@redux/rootApi';
import { Endpoints } from '@shared';



export const PrivateChannelApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        [Endpoints.V1.PrivateChannel.Create.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.PrivateChannel.Create.Response,
            Endpoints.V1.PrivateChannel.Create.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.PrivateChannel.Create.Path,
                method: Endpoints.V1.PrivateChannel.Create.Method,
                body,
            }),
        }),
        [Endpoints.V1.PrivateChannel.GetOne.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.PrivateChannel.GetOne.Response,
            Endpoints.V1.PrivateChannel.GetOne.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.PrivateChannel.GetOne.Path,
                method: Endpoints.V1.PrivateChannel.GetOne.Method,
                body,
            }),
        }),
    }),
    overrideExisting: false,
});