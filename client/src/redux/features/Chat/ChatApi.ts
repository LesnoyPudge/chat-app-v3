import { rootApi } from '@redux/rootApi';
import { Endpoints } from '@shared';



export const ChatApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        [Endpoints.V1.Chat.GetOne.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Chat.GetOne.Response,
            Endpoints.V1.Chat.GetOne.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Chat.GetOne.Path,
                method: Endpoints.V1.Chat.GetOne.Method,
                body,
            }),
        }),
    }),
    overrideExisting: false,
});