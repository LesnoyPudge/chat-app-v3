import { rootApi } from '@redux/rootApi';
import { Endpoints } from '@shared';



export const UserApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        [Endpoints.V1.User.AcceptFriendRequest.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.AcceptFriendRequest.Response,
            Endpoints.V1.User.AcceptFriendRequest.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.AcceptFriendRequest.Path,
                method: Endpoints.V1.User.AcceptFriendRequest.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.Block.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.Block.Response,
            Endpoints.V1.User.Block.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.Block.Path,
                method: Endpoints.V1.User.Block.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.CredentialsUpdate.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.CredentialsUpdate.Response,
            Endpoints.V1.User.CredentialsUpdate.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.CredentialsUpdate.Path,
                method: Endpoints.V1.User.CredentialsUpdate.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.DeclineFriendRequest.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.DeclineFriendRequest.Response,
            Endpoints.V1.User.DeclineFriendRequest.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.DeclineFriendRequest.Path,
                method: Endpoints.V1.User.DeclineFriendRequest.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.Delete.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.Delete.Response,
            Endpoints.V1.User.Delete.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.Delete.Path,
                method: Endpoints.V1.User.Delete.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.DeleteFriend.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.DeleteFriend.Response,
            Endpoints.V1.User.DeleteFriend.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.DeleteFriend.Path,
                method: Endpoints.V1.User.DeleteFriend.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.GetOne.ActionNameWithEntity]: build.query<
            Endpoints.V1.User.GetOne.Response,
            Endpoints.V1.User.GetOne.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.GetOne.Path,
                method: Endpoints.V1.User.GetOne.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.HidePrivateChannel.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.HidePrivateChannel.Response,
            Endpoints.V1.User.HidePrivateChannel.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.HidePrivateChannel.Path,
                method: Endpoints.V1.User.HidePrivateChannel.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.Login.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.Login.Response,
            Endpoints.V1.User.Login.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.Login.Path,
                method: Endpoints.V1.User.Login.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.Logout.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.Logout.Response,
            Endpoints.V1.User.Logout.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.Logout.Path,
                method: Endpoints.V1.User.Logout.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.ProfileUpdate.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.ProfileUpdate.Response,
            Endpoints.V1.User.ProfileUpdate.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.ProfileUpdate.Path,
                method: Endpoints.V1.User.ProfileUpdate.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.Refresh.ActionNameWithEntity]: build.query<
            Endpoints.V1.User.Refresh.Response,
            Endpoints.V1.User.Refresh.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.Refresh.Path,
                method: Endpoints.V1.User.Refresh.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.Registration.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.Registration.Response,
            Endpoints.V1.User.Registration.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.Registration.Path,
                method: Endpoints.V1.User.Registration.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.RequestAccessCode.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.RequestAccessCode.Response,
            Endpoints.V1.User.RequestAccessCode.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.RequestAccessCode.Path,
                method: Endpoints.V1.User.RequestAccessCode.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.RevokeFriendRequest.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.RevokeFriendRequest.Response,
            Endpoints.V1.User.RevokeFriendRequest.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.RevokeFriendRequest.Path,
                method: Endpoints.V1.User.RevokeFriendRequest.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.SendFriendRequest.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.SendFriendRequest.Response,
            Endpoints.V1.User.SendFriendRequest.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.SendFriendRequest.Path,
                method: Endpoints.V1.User.SendFriendRequest.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.Unblock.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.Unblock.Response,
            Endpoints.V1.User.Unblock.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.Unblock.Path,
                method: Endpoints.V1.User.Unblock.Method,
                body,
            }),
        }),
        [Endpoints.V1.User.VerifyAccessCode.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.VerifyAccessCode.Response,
            Endpoints.V1.User.VerifyAccessCode.RequestBody
        >({
            query: (body) => ({
                url: Endpoints.V1.User.VerifyAccessCode.Path,
                method: Endpoints.V1.User.VerifyAccessCode.Method,
                body,
            }),
        }),
    }),
    overrideExisting: false,
});