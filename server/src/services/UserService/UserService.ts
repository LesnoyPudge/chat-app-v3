import { UserDto } from '../../dtos';
import { UserModel } from '../../models';
import { IUser } from '../../types';
import { transactionContainer, ApiError } from '../../utils';



interface IUserReq {
    login: string;
    username: string;
    password: string;
    email: string;
}

interface IGetReq {
    targetId: string;
}

interface IUserService {
    create: (user: IUserReq) => Promise<IUser>;
    get: ({ targetId }: IGetReq) => Promise<IUser>
    update: () => Promise<any>;
}

export const UserService: IUserService = {
    async create({ email, login, password, username }) {
        return await transactionContainer(
            async({ queryOptions, onCommit }) => {
                console.log('got message in service');
                const user = await UserModel.create([{ email, login, password, username }], queryOptions({ lean: true }));
                
                onCommit(() => {
                    console.log(user);
                });
                
                const wow = await UserService.update();

                const newUser = UserDto.objectFromModel(user[0]);

                return newUser;
            },
        );
    },

    async get({ targetId }) {
        return await transactionContainer(
            async({ queryOptions }) => {
                const user = await UserModel.findById(targetId, {}, queryOptions({ lean: true }));
                if (!user) throw ApiError.notFound(); // do delete?

                return UserDto.objectFromModel(user);
            },
        );
    },

    async update() {
        return await transactionContainer(
            async({ queryOptions, onCommit }) => {
                const wow = await UserModel.findOneAndUpdate(
                    { username: 'myUsername' }, 
                    { username: 'newUsername' }, 
                    queryOptions({ new: true }),
                );

                onCommit(() => {
                    console.log(wow); // to delete?
                });

                // ApiError.forbidden();

                return wow;
            },
        );
    },
};