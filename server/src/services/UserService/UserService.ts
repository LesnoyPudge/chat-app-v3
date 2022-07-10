


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

interface IUserService {
    create: (user: IUserReq) => Promise<IUserRes>;
}

export const UserService: IUserService = {
    async create({email, login, password, username}) {
        console.log('got message in service');
        // throw new Error('error in message service');
        const date = new Date();
        const user = {email, login, password, username, avatar: '', createdAt: date};

        return user;
    },
};