import { rootApi } from '@redux/rootApi';
import { Endpoints } from '@shared';



export const HelperApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        [Endpoints.V1.Helper.GetAvailableTextRoomIds.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Helper.GetAvailableTextRoomIds.Response,
            Endpoints.V1.Helper.GetAvailableTextRoomIds.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Helper.GetAvailableTextRoomIds.Path,
                method: Endpoints.V1.Helper.GetAvailableTextRoomIds.Method,
                body,
            }),
        }),
    }),
    overrideExisting: false,
});