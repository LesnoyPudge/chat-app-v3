import { IUserModel, UserModel } from '../../models';
import { transactionContainer } from '../../utils';



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
    create: (user: IUserReq) => Promise<IUserRes | undefined>;
    update: () => Promise<any>;
}

export const UserService: IUserService = {
    async create({email, login, password, username}) {
        return await transactionContainer(
            async({queryOptions, onCommit}) => {
                console.log('got message in service');
                const user = await UserModel.create([{email, login, password, username}], queryOptions());
                // throw new Error('error in message service');
                onCommit(() => {
                    console.log(user);
                });
                
                const wow = await UserService.update();

                const dto = ({email, login, password, username, createdAt, avatar}: IUserModel | any): IUserRes => {
                    return {
                        email, 
                        login, 
                        password, 
                        username, 
                        createdAt, 
                        avatar,
                    };
                };
                const newUser = dto(user[0]);

                return newUser;
            },
        );
    },

    async update() {
        return await transactionContainer(
            async({queryOptions, onCommit}) => {
                const wow = await UserModel.findOneAndUpdate(
                    {username: 'myUsername'}, 
                    {username: 'newUsername'}, 
                    queryOptions({new: true}),
                );

                onCommit(() => {
                    console.log(wow);
                });
                // throw new Error('error in message service');
                return wow;
            },
        );
    },
};