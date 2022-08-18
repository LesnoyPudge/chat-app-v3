import ms from 'ms';
import { AuthorizedControllerType, ControllerType, IAuthResponse, IUser, ILoginUserRequest, IRegistrationUserRequest, IGetOneUserRequest, IGetManyUserRequest, IUpdateUserRequest, IBlockUserRequest, IUnblockUserRequest, ISendFriendRequestUserRequest, IAcceptFriendRequestUserRequest, IDeclineFriendRequestUserRequest, IRevokeFriendRequestUserRequest, IDeleteFriendUserRequest } from '@types';
import { UserService } from '@services';
import { getEnv } from '@utils';



interface IUserController {
    registration: ControllerType<IRegistrationUserRequest, never, IAuthResponse>;
    login: ControllerType<ILoginUserRequest, never, IAuthResponse>;
    logout: ControllerType<void, never, void>;
    refresh: ControllerType<void, never, IAuthResponse>;
    getOne: AuthorizedControllerType<IGetOneUserRequest, never, IUser>;
    getMany: AuthorizedControllerType<IGetManyUserRequest, never, IUser[]>
    update: AuthorizedControllerType<IUpdateUserRequest, never, IUser>;
    blockUser: AuthorizedControllerType<IBlockUserRequest, never, IUser>;
    unblockUser: AuthorizedControllerType<IUnblockUserRequest, never, IUser>;
    requestAccessCode: AuthorizedControllerType<void, never, IUser>;
    sendFriendRequest: AuthorizedControllerType<ISendFriendRequestUserRequest, never, IUser>;
    acceptFriendRequest: AuthorizedControllerType<IAcceptFriendRequestUserRequest, never, IUser>;
    declineFriendRequest: AuthorizedControllerType<IDeclineFriendRequestUserRequest, never, IUser>;
    revokeFriendRequest: AuthorizedControllerType<IRevokeFriendRequestUserRequest, never, IUser>;
    deleteFriend: AuthorizedControllerType<IDeleteFriendUserRequest, never, IUser>;
    
    some: AuthorizedControllerType<void, never, void>;
}

const { REFRESH_TOKEN_DURATION } = getEnv();

export const UserController: IUserController = {
    async registration(req, res) {
        const { email, login, password, username } = req.body;
        
        const { user, accessToken, refreshToken } = await UserService.registration({ email, login, password, username });

        res.cookie('refreshToken', refreshToken, { maxAge: ms(REFRESH_TOKEN_DURATION) });
        res.json({ user, accessToken, refreshToken });
    },

    async login(req, res) {
        const { login, password } = req.body;
        
        const { accessToken, refreshToken: newRefreshToken, user } = await UserService.login({ login, password });

        res.cookie('refreshToken', newRefreshToken, { maxAge: ms(REFRESH_TOKEN_DURATION) });
        res.json({ user, accessToken, refreshToken: newRefreshToken });
    },

    async logout(req, res) {
        const { refreshToken } = req.cookies;

        await UserService.logout({ refreshToken });

        res.clearCookie('refreshToken');
        res.status(200).json();
    },

    async refresh(req, res) {
        const { refreshToken } = req.cookies;
        
        const { accessToken, refreshToken: newRefreshToken, user } = await UserService.refresh({ refreshToken });

        res.cookie('refreshToken', newRefreshToken, { maxAge: ms(REFRESH_TOKEN_DURATION) });
        res.json({ user, accessToken, refreshToken: newRefreshToken });
    },

    async getOne(req, res) {
        const { targetId } = req.body;
        const { id } = req.auth.user;
    
        const user = await UserService.getOne({ userId: id, targetId });

        res.json(user);
    },

    async getMany(req, res) {
        const { targetIds } = req.body;
        const { id } = req.auth.user;
    
        const users = await UserService.getMany({ userId: id, targetIds });

        res.json(users);
    },
    
    async update(req, res) {
        const { id } = req.auth.user;
        const { newValues } = req.body;
        
        const updatedUser = await UserService.update({ userId: id, newValues });

        res.json(updatedUser);
    },

    async blockUser(req, res) {
        const { id } = req.auth.user;
        const { targetId } = req.body;
        
        const updatedUser = await UserService.blockUser({ userId: id, targetId });

        res.json(updatedUser);
    },

    async unblockUser(req, res) {
        const { id } = req.auth.user;
        const { targetId } = req.body;
        
        const updatedUser = await UserService.unblockUser({ userId: id, targetId });

        res.json(updatedUser);
    },

    async requestAccessCode(req, res) {
        const { id } = req.auth.user;

        await UserService.requestAccessCode({ userId: id });

        res.status(200).json();
    },

    async sendFriendRequest(req, res) {
        const { id } = req.auth.user;
        const { to } = req.body;
        
        const updatedUser = await UserService.sendFriendRequest({ userId: id, to });

        res.json(updatedUser);
    },

    async acceptFriendRequest(req, res) {
        const { id } = req.auth.user;
        const { from } = req.body;
        
        const updatedUser = await UserService.acceptFriendRequest({ userId: id, from });

        res.json(updatedUser);
    },

    async declineFriendRequest(req, res) {
        const { id } = req.auth.user;
        const { from } = req.body;
        
        const updatedUser = await UserService.declineFriendRequest({ userId: id, from });

        res.json(updatedUser);
    },

    async revokeFriendRequest(req, res) {
        const { id } = req.auth.user;
        const { to } = req.body;
        
        const updatedUser = await UserService.revokeFriendRequest({ userId: id, to });

        res.json(updatedUser);
    },

    async deleteFriend(req, res) {
        const { id } = req.auth.user;
        const { targetId } = req.body;
        
        const updatedUser = await UserService.deleteFriend({ userId: id, targetId });

        res.json(updatedUser);
    },
    
    async some(req, res) {
        const user = req.auth.user;

        console.log('got some:', user.username);

        res.status(200).json();
    },
};