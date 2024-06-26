import { rootApi } from '@redux/rootApi';
import { Endpoints } from '@shared';



export const RoleApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        [Endpoints.V1.Role.AddMember.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Role.AddMember.Response,
            Endpoints.V1.Role.AddMember.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Role.AddMember.Path,
                method: Endpoints.V1.Role.AddMember.Method,
                body,
            }),
        }),
        [Endpoints.V1.Role.Create.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Role.Create.Response,
            Endpoints.V1.Role.Create.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Role.Create.Path,
                method: Endpoints.V1.Role.Create.Method,
                body,
            }),
        }),
        [Endpoints.V1.Role.Delete.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Role.Delete.Response,
            Endpoints.V1.Role.Delete.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Role.Delete.Path,
                method: Endpoints.V1.Role.Delete.Method,
                body,
            }),
        }),
        [Endpoints.V1.Role.GetOne.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Role.GetOne.Response,
            Endpoints.V1.Role.GetOne.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Role.GetOne.Path,
                method: Endpoints.V1.Role.GetOne.Method,
                body,
            }),
        }),
        [Endpoints.V1.Role.RemoveMember.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Role.RemoveMember.Response,
            Endpoints.V1.Role.RemoveMember.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Role.RemoveMember.Path,
                method: Endpoints.V1.Role.RemoveMember.Method,
                body,
            }),
        }),
        [Endpoints.V1.Role.Update.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.Role.Update.Response,
            Endpoints.V1.Role.Update.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.Role.Update.Path,
                method: Endpoints.V1.Role.Update.Method,
                body,
            }),
        }),
    }),
    overrideExisting: false,
});