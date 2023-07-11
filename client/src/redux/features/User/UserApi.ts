import { rootApi } from '@redux/rootApi';
import { Endpoints } from '@shared';



export const UserApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        [Endpoints.V1.User.AcceptFriendRequest.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.AcceptFriendRequest.Response,
            Endpoints.V1.User.AcceptFriendRequest.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.AcceptFriendRequest.Path,
                method: Endpoints.V1.User.AcceptFriendRequest.Method,
            }),
        }),
        [Endpoints.V1.User.Block.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.Block.Response,
            Endpoints.V1.User.Block.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.Block.Path,
                method: Endpoints.V1.User.Block.Method,
            }),
        }),
        [Endpoints.V1.User.CredentialsUpdate.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.CredentialsUpdate.Response,
            Endpoints.V1.User.CredentialsUpdate.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.CredentialsUpdate.Path,
                method: Endpoints.V1.User.CredentialsUpdate.Method,
            }),
        }),
        [Endpoints.V1.User.DeclineFriendRequest.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.DeclineFriendRequest.Response,
            Endpoints.V1.User.DeclineFriendRequest.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.DeclineFriendRequest.Path,
                method: Endpoints.V1.User.DeclineFriendRequest.Method,
            }),
        }),
        [Endpoints.V1.User.Delete.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.Delete.Response,
            Endpoints.V1.User.Delete.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.Delete.Path,
                method: Endpoints.V1.User.Delete.Method,
            }),
        }),
        [Endpoints.V1.User.DeleteFriend.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.DeleteFriend.Response,
            Endpoints.V1.User.DeleteFriend.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.DeleteFriend.Path,
                method: Endpoints.V1.User.DeleteFriend.Method,
            }),
        }),
        [Endpoints.V1.User.GetOne.ActionNameWithEntity]: build.query<
            Endpoints.V1.User.GetOne.Response,
            Endpoints.V1.User.GetOne.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.GetOne.Path,
                method: Endpoints.V1.User.GetOne.Method,
            }),
        }),
        [Endpoints.V1.User.HidePrivateChannel.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.HidePrivateChannel.Response,
            Endpoints.V1.User.HidePrivateChannel.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.HidePrivateChannel.Path,
                method: Endpoints.V1.User.HidePrivateChannel.Method,
            }),
        }),
        [Endpoints.V1.User.Login.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.Login.Response,
            Endpoints.V1.User.Login.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.Login.Path,
                method: Endpoints.V1.User.Login.Method,
            }),
        }),
        [Endpoints.V1.User.Logout.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.Logout.Response,
            Endpoints.V1.User.Logout.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.Logout.Path,
                method: Endpoints.V1.User.Logout.Method,
            }),
        }),
        [Endpoints.V1.User.ProfileUpdate.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.ProfileUpdate.Response,
            Endpoints.V1.User.ProfileUpdate.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.ProfileUpdate.Path,
                method: Endpoints.V1.User.ProfileUpdate.Method,
            }),
        }),
        [Endpoints.V1.User.Refresh.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.Refresh.Response,
            Endpoints.V1.User.Refresh.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.Refresh.Path,
                method: Endpoints.V1.User.Refresh.Method,
            }),
        }),
        [Endpoints.V1.User.Registration.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.Registration.Response,
            Endpoints.V1.User.Registration.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.Registration.Path,
                method: Endpoints.V1.User.Registration.Method,
            }),
        }),
        [Endpoints.V1.User.RequestAccessCode.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.RequestAccessCode.Response,
            Endpoints.V1.User.RequestAccessCode.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.RequestAccessCode.Path,
                method: Endpoints.V1.User.RequestAccessCode.Method,
            }),
        }),
        [Endpoints.V1.User.RevokeFriendRequest.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.RevokeFriendRequest.Response,
            Endpoints.V1.User.RevokeFriendRequest.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.RevokeFriendRequest.Path,
                method: Endpoints.V1.User.RevokeFriendRequest.Method,
            }),
        }),
        [Endpoints.V1.User.SendFriendRequest.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.SendFriendRequest.Response,
            Endpoints.V1.User.SendFriendRequest.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.SendFriendRequest.Path,
                method: Endpoints.V1.User.SendFriendRequest.Method,
            }),
        }),
        [Endpoints.V1.User.Unblock.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.Unblock.Response,
            Endpoints.V1.User.Unblock.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.Unblock.Path,
                method: Endpoints.V1.User.Unblock.Method,
            }),
        }),
        [Endpoints.V1.User.VerifyAccessCode.ActionNameWithEntity]: build.mutation<
            Endpoints.V1.User.VerifyAccessCode.Response,
            Endpoints.V1.User.VerifyAccessCode.RequestBody
        >({
            query: () => ({
                url: Endpoints.V1.User.VerifyAccessCode.Path,
                method: Endpoints.V1.User.VerifyAccessCode.Method,
            }),
        }),
    }),
    overrideExisting: false,
});