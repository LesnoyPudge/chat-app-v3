import { rootApi } from '@redux/rootApi';
import { Endpoints } from '@shared';



export const ChannelApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        [Endpoints.V1.Channel.AcceptInvitation.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Channel.AcceptInvitation.Response,
            Endpoints.V1.Channel.AcceptInvitation.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Channel.AcceptInvitation.Path,
                method: Endpoints.V1.Channel.AcceptInvitation.Method,
                body,
            }),
        }),
        [Endpoints.V1.Channel.Ban.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Channel.Ban.Response,
            Endpoints.V1.Channel.Ban.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Channel.Ban.Path,
                method: Endpoints.V1.Channel.Ban.Method,
                body,
            }),
        }),
        [Endpoints.V1.Channel.Create.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Channel.Create.Response,
            Endpoints.V1.Channel.Create.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Channel.Create.Path,
                method: Endpoints.V1.Channel.Create.Method,
                body,
            }),
        }),
        [Endpoints.V1.Channel.CreateInvitation.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Channel.CreateInvitation.Response,
            Endpoints.V1.Channel.CreateInvitation.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Channel.CreateInvitation.Path,
                method: Endpoints.V1.Channel.CreateInvitation.Method,
                body,
            }),
        }),
        [Endpoints.V1.Channel.Delete.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Channel.Delete.Response,
            Endpoints.V1.Channel.Delete.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Channel.Delete.Path,
                method: Endpoints.V1.Channel.Delete.Method,
                body,
            }),
        }),
        [Endpoints.V1.Channel.DeleteInvitation.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Channel.DeleteInvitation.Response,
            Endpoints.V1.Channel.DeleteInvitation.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Channel.DeleteInvitation.Path,
                method: Endpoints.V1.Channel.DeleteInvitation.Method,
                body,
            }),
        }),
        [Endpoints.V1.Channel.GetOne.ActionNameWithEntity]: build.query<
            Endpoints.V1.Channel.GetOne.Response,
            Endpoints.V1.Channel.GetOne.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Channel.GetOne.Path,
                method: Endpoints.V1.Channel.GetOne.Method,
                body,
            }),
        }),
        [Endpoints.V1.Channel.Kick.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Channel.Kick.Response,
            Endpoints.V1.Channel.Kick.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Channel.Kick.Path,
                method: Endpoints.V1.Channel.Kick.Method,
                body,
            }),
        }),
        [Endpoints.V1.Channel.Leave.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Channel.Leave.Response,
            Endpoints.V1.Channel.Leave.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Channel.Leave.Path,
                method: Endpoints.V1.Channel.Leave.Method,
                body,
            }),
        }),
        [Endpoints.V1.Channel.Unban.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Channel.Unban.Response,
            Endpoints.V1.Channel.Unban.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Channel.Unban.Path,
                method: Endpoints.V1.Channel.Unban.Method,
                body,
            }),
        }),
        [Endpoints.V1.Channel.Update.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Channel.Update.Response,
            Endpoints.V1.Channel.Update.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Channel.Update.Path,
                method: Endpoints.V1.Channel.Update.Method,
                body,
            }),
        }),
    }),
    overrideExisting: false,
});