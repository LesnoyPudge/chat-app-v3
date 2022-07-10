import { ControllerType } from '../../../types';
import { UserService } from '../../services';



interface IUserReq {
    login: string;
    username: string;
    password: string;
    email: string;
}

interface IUserRes {
    login: string;
    username: string;
    password: string;
    avatar: string;
    email: string;
    createdAt: Date;
}

interface IUserController {
    create: ControllerType<IUserReq, any, IUserRes>;
}

export const UserController: IUserController = {
    async create(req, res) {
        const user = req.body;
        
        const data = await UserService.create({...user});

        res.json(data);
    },
};