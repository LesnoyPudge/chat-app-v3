import { ServiceType } from '@types';
import { transactionContainer } from '@utils';



interface IUserService {
    create: ServiceType<{name: string, identifier: string}, any>;
}

export const UserService: IUserService = {
    async create({ name, identifier }) {
        return await transactionContainer(
            async({ queryOptions }) => {
                
            },
        );
    },
};