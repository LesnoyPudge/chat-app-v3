import { rootApi } from '@redux/rootApi';
import { Endpoints } from '@shared';



export const MessageApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        [Endpoints.V1.Message.Create.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Message.Create.Response,
            Endpoints.V1.Message.Create.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.Message.Create.Path,
                method: Endpoints.V1.Message.Create.Method,
            }),
        }),
        [Endpoints.V1.Message.Delete.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Message.Delete.Response,
            Endpoints.V1.Message.Delete.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.Message.Delete.Path,
                method: Endpoints.V1.Message.Delete.Method,
            }),
        }),
        [Endpoints.V1.Message.DeleteAttachment.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Message.DeleteAttachment.Response,
            Endpoints.V1.Message.DeleteAttachment.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.Message.DeleteAttachment.Path,
                method: Endpoints.V1.Message.DeleteAttachment.Method,
            }),
        }),
        [Endpoints.V1.Message.GetOne.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Message.GetOne.Response,
            Endpoints.V1.Message.GetOne.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.Message.GetOne.Path,
                method: Endpoints.V1.Message.GetOne.Method,
            }),
        }),
        [Endpoints.V1.Message.Restore.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Message.Restore.Response,
            Endpoints.V1.Message.Restore.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.Message.Restore.Path,
                method: Endpoints.V1.Message.Restore.Method,
            }),
        }),
        [Endpoints.V1.Message.Update.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Message.Update.Response,
            Endpoints.V1.Message.Update.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.Message.Update.Path,
                method: Endpoints.V1.Message.Update.Method,
            }),
        }),
    }),
    overrideExisting: false,
});