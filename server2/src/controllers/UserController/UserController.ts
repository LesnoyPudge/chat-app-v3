import { UserService } from '@services';
import { getEnv } from '@utils';
import { Endpoints, Tokens } from '@shared';
import { AuthorizedMiddleware, Middleware } from '@types';
import ms from 'ms';
import { ApiError } from '@errors';
import HTTP_STATUS_CODES from 'http-status-enum';



interface UserController {
    [Endpoints.V1.User.Registration.ActionName]: Middleware<
        Endpoints.V1.User.Registration.RequestBody,
        Endpoints.V1.User.Registration.Response
    >;
    [Endpoints.V1.User.Login.ActionName]: Middleware<
        Endpoints.V1.User.Login.RequestBody,
        Endpoints.V1.User.Login.Response
    >;
    [Endpoints.V1.User.Logout.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.User.Logout.RequestBody,
        Endpoints.V1.User.Logout.Response
    >;
    [Endpoints.V1.User.Refresh.ActionName]: Middleware<
        Endpoints.V1.User.Refresh.RequestBody,
        Endpoints.V1.User.Refresh.Response
    >;
    [Endpoints.V1.User.GetOne.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.User.GetOne.RequestBody,
        Endpoints.V1.User.GetOne.Response
    >;
    [Endpoints.V1.User.ProfileUpdate.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.User.ProfileUpdate.RequestBody,
        Endpoints.V1.User.ProfileUpdate.Response
    >;
    [Endpoints.V1.User.CredentialsUpdate.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.User.CredentialsUpdate.RequestBody,
        Endpoints.V1.User.CredentialsUpdate.Response
    >;
    [Endpoints.V1.User.Delete.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.User.Delete.RequestBody,
        Endpoints.V1.User.Delete.Response
    >;
    [Endpoints.V1.User.Block.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.User.Block.RequestBody,
        Endpoints.V1.User.Block.Response
    >;
    [Endpoints.V1.User.Unblock.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.User.Unblock.RequestBody,
        Endpoints.V1.User.Unblock.Response
    >;
    [Endpoints.V1.User.RequestAccessCode.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.User.RequestAccessCode.RequestBody,
        Endpoints.V1.User.RequestAccessCode.Response
    >;
    [Endpoints.V1.User.VerifyAccessCode.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.User.VerifyAccessCode.RequestBody,
        Endpoints.V1.User.VerifyAccessCode.Response
    >;
    [Endpoints.V1.User.SendFriendRequest.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.User.SendFriendRequest.RequestBody,
        Endpoints.V1.User.SendFriendRequest.Response
    >;
    [Endpoints.V1.User.AcceptFriendRequest.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.User.AcceptFriendRequest.RequestBody,
        Endpoints.V1.User.AcceptFriendRequest.Response
    >;
    [Endpoints.V1.User.DeclineFriendRequest.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.User.DeclineFriendRequest.RequestBody,
        Endpoints.V1.User.DeclineFriendRequest.Response
    >;
    [Endpoints.V1.User.RevokeFriendRequest.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.User.RevokeFriendRequest.RequestBody,
        Endpoints.V1.User.RevokeFriendRequest.Response
    >;
    [Endpoints.V1.User.DeleteFriend.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.User.DeleteFriend.RequestBody,
        Endpoints.V1.User.DeleteFriend.Response
    >;
    [Endpoints.V1.User.HidePrivateChannel.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.User.HidePrivateChannel.RequestBody,
        Endpoints.V1.User.HidePrivateChannel.Response
    >;
}

const { 
    REFRESH_TOKEN_DURATION, 
    CUSTOM_NODE_ENV, 
    ACCESS_TOKEN_DURATION,
} = getEnv();

const refreshTokenName: keyof Pick<Tokens, 'refreshToken'> = 'refreshToken';
const accessTokenName: keyof Pick<Tokens, 'accessToken'> = 'accessToken';

const secureCookiesOptions = {
    access: () => {
        return {
            maxAge: ms(ACCESS_TOKEN_DURATION),
            httpOnly: true,
            secure: CUSTOM_NODE_ENV === 'production',
        };
    },
    refresh: () => ({
        maxAge: ms(REFRESH_TOKEN_DURATION),
        httpOnly: true,
        secure: CUSTOM_NODE_ENV === 'production',
        path: Endpoints.V1.User.Refresh.Path,
    }),
    resetRefresh: () => ({
        httpOnly: true,
        secure: CUSTOM_NODE_ENV === 'production',
        path: Endpoints.V1.User.Refresh.Path,
        expires: new Date(0),
    }),
};

export const UserController: UserController = {
    async registration(req, res) {
        const data = await UserService.registration(req.body);
        
        res.cookie(refreshTokenName, data.refreshToken, secureCookiesOptions.refresh());
        res.cookie(accessTokenName, data.accessToken, secureCookiesOptions.access());
        res.json(data.user);
    },

    async login(req, res) {
        const data = await UserService.login(req.body);

        res.cookie(refreshTokenName, data.refreshToken, secureCookiesOptions.refresh());
        res.cookie(accessTokenName, data.accessToken, secureCookiesOptions.access());
        res.json(data.user);
    },

    async logout(req, res) {
        res.cookie(refreshTokenName, '', secureCookiesOptions.resetRefresh());
        res.clearCookie(accessTokenName);
        res.sendStatus(HTTP_STATUS_CODES.OK);
    },

    async refresh(req, res) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) throw ApiError.unauthorized();

        const data = await UserService.refresh({ refreshToken });

        res.cookie(accessTokenName, data.accessToken, secureCookiesOptions.access());
        res.json(data.user);
    },

    async getOne(req, res) {
        const user = await UserService.getOne(req.auth, req.body);
        res.json(user);
    },

    async profileUpdate(req, res) {
        const user = await UserService.profileUpdate(req.auth, req.body);
        res.json(user);
    },

    async credentialsUpdate(req, res) {
        const user = await UserService.credentialsUpdate(req.auth, req.body);
        res.json(user);
    },

    async delete(req, res) {
        await UserService.delete(req.auth);
        res.sendStatus(HTTP_STATUS_CODES.OK);
    },

    async block(req, res) {
        const user = await UserService.block(req.auth, req.body);
        res.json(user);
    },

    async unblock(req, res) {
        const user = await UserService.unblock(req.auth, req.body);
        res.json(user);
    },

    async requestAccessCode(req, res) {
        await UserService.requestAccessCode(req.auth);
        res.sendStatus(HTTP_STATUS_CODES.OK);
    },

    async sendFriendRequest(req, res) {
        const user = await UserService.sendFriendRequest(req.auth, req.body);
        res.json(user);
    },

    async acceptFriendRequest(req, res) {
        const user = await UserService.acceptFriendRequest(req.auth, req.body);
        res.json(user);
    },

    async declineFriendRequest(req, res) {
        const user = await UserService.declineFriendRequest(req.auth, req.body);
        res.json(user);
    },

    async revokeFriendRequest(req, res) {
        const user = await UserService.revokeFriendRequest(req.auth, req.body);
        res.json(user);
    },

    async deleteFriend(req, res) {
        const user = await UserService.deleteFriend(req.auth, req.body);
        res.json(user);
    },

    async verifyAccessCode(req, res) {
        await UserService.verifyAccessCode(req.auth, req.body);
        res.sendStatus(HTTP_STATUS_CODES.OK);
    },

    async hidePrivateChannel(req, res) {
        const user = await UserService.hidePrivateChannel(req.auth, req.body);
        res.json(user);
    },
};