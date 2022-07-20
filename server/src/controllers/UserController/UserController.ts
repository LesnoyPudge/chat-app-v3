import { AuthorizedControllerType, ControllerType, IAuthResponse, IUserLoginReq, IUserRegistrationReq } from '../../types';
import { UserService } from '../../services';



interface IUserController {
    registration: ControllerType<IUserRegistrationReq, any, IAuthResponse>;
    login: ControllerType<IUserLoginReq, any, IAuthResponse>;
    logout: ControllerType<any, any, void>;
    refresh: ControllerType<any, any, IAuthResponse>;
    some: AuthorizedControllerType<any, any, any>;
    // update: ControllerType<any, any, IUser>;
}

export const UserController: IUserController = {
    async registration(req, res) {
        const { email, login, password, username } = req.body;
        
        const { user, accessToken, refreshToken } = await UserService.registration({ email, login, password, username });

        res.cookie('refreshToken', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 });

        res.json({ user, accessToken });
    },

    async login(req, res) {
        const { login, password } = req.body;
        
        const data = await UserService.login({ login, password });

        res.cookie('refreshToken', data.refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 });

        res.json({ user: data.user, accessToken: data.accessToken });
    },

    async logout(req, res) {
        const { refreshToken } = req.cookies;

        await UserService.logout({ refreshToken });

        res.clearCookie('refreshToken');

        res.status(200).json();
        // res.status(500).json();
    },

    async refresh(req, res) {
        const { refreshToken } = req.cookies;
        
        const data = await UserService.refresh({ refreshToken });

        res.cookie('refreshToken', data.refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 });

        res.json({ user: data.user, accessToken: data.accessToken });
        // res.status(500).json();
    },

    async some(req, res) {
        const user = req.auth.user;
        console.log('got some');
        res.status(200).json();
    },

    // async update(req, res) {
    //     const { userId, username } = req.body;
    //     console.log(req.body);
        
    //     const data = await UserService.update({ userId, username });

    //     res.json(data);
    // },
};