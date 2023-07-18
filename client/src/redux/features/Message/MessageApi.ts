import { rootApi } from '@redux/rootApi';
import { Endpoints } from '@shared';



export const MessageApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        [Endpoints.V1.Message.Create.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Message.Create.Response,
            Endpoints.V1.Message.Create.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Message.Create.Path,
                method: Endpoints.V1.Message.Create.Method,
                body,
            }),
        }),
        [Endpoints.V1.Message.Delete.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Message.Delete.Response,
            Endpoints.V1.Message.Delete.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Message.Delete.Path,
                method: Endpoints.V1.Message.Delete.Method,
                body,
            }),
        }),
        [Endpoints.V1.Message.DeleteAttachment.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Message.DeleteAttachment.Response,
            Endpoints.V1.Message.DeleteAttachment.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Message.DeleteAttachment.Path,
                method: Endpoints.V1.Message.DeleteAttachment.Method,
                body,
            }),
        }),
        [Endpoints.V1.Message.GetOne.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Message.GetOne.Response,
            Endpoints.V1.Message.GetOne.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Message.GetOne.Path,
                method: Endpoints.V1.Message.GetOne.Method,
                body,
            }),
        }),
        [Endpoints.V1.Message.Restore.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Message.Restore.Response,
            Endpoints.V1.Message.Restore.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Message.Restore.Path,
                method: Endpoints.V1.Message.Restore.Method,
                body,
            }),
        }),
        [Endpoints.V1.Message.Update.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Message.Update.Response,
            Endpoints.V1.Message.Update.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Message.Update.Path,
                method: Endpoints.V1.Message.Update.Method,
                body,
            }),
        }),
    }),
    overrideExisting: false,
});