import { ControllerType, IUser, IUserLoginReq, IUserRegistrationReq } from '../../types';
import { UserService } from '../../services';



interface IUserController {
    registration: ControllerType<IUserRegistrationReq, any, { user: IUser; accessToken: string; }>;
    login: ControllerType<IUserLoginReq, any, {user: IUser, accessToken: string;}>;
    logout: ControllerType<any, any, void>;
    // update: ControllerType<any, any, IUser>;
}

export const UserController: IUserController = {
    async registration(req, res) {
        const { email, login, password, username } = req.body;
        
        const { user, accessToken, refreshToken } = await UserService.registration({ email, login, password, username });

        res.cookie('refreshToken', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });

        res.json({ user, accessToken });
    },

    async login(req, res) {
        const { login, password } = req.body;
        
        const { user, accessToken, refreshToken } = await UserService.login({ login, password });

        res.cookie('refreshToken', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });

        res.json({ user, accessToken });
    },

    async logout(req, res) {
        const { refreshToken }: {refreshToken: string} = req.cookies;
        const authData = {
            userId: 'qwe',
            refreshToken,
        };
        await UserService.logout({ authData });

        res.clearCookie('refreshToken');

        return res.sendStatus(200);
    },
    // async update(req, res) {
    //     const { userId, username } = req.body;
    //     console.log(req.body);
        
    //     const data = await UserService.update({ userId, username });

    //     res.json(data);
    // },
};