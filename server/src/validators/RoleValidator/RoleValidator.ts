import { ICreateRoleRequest, IGetOneRoleRequest, IGetManyRolesRequest, IUpdateRoleRequest, IDeleteRoleRequest, IAddUserRoleRequest, IDeleteUserRoleRequest } from '@types';
import { createValidator, ObjectToValidatorsChain } from '../createValidator';
import { isChannelExistById, isImChannelAdministrator, isImChannelMember, isImChannelOwner, isMongoId, isRoleExistById, notEmpty, reject, sanitizeInput, toString } from '../validationChains';



interface IRoleValidators {
    create: ObjectToValidatorsChain<ICreateRoleRequest>;
    getOne: ObjectToValidatorsChain<IGetOneRoleRequest>;
    // getMany: ObjectToValidatorsChain<IGetManyRolesRequest>;
    update: ObjectToValidatorsChain<IUpdateRoleRequest>;
    delete: ObjectToValidatorsChain<IDeleteRoleRequest>;
    addUser: ObjectToValidatorsChain<IAddUserRoleRequest>;
    deleteUser: ObjectToValidatorsChain<IDeleteUserRoleRequest>;
}

const roleValidators: IRoleValidators = {
    create: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImChannelAdministrator({ fieldName: 'channelId' }),
            isImChannelOwner({ fieldName: 'channelId' }),
            reject({ fieldName: 'channelId', errorMessage: 'Нет разрешения на создание ролей' }),
        ],
        
        name: [
            sanitizeInput({ fieldName: 'name' }),
            notEmpty({ fieldName: 'name' }),
            toString({ fieldName: 'name' }),
        ],
    },
    
    getOne: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isImChannelMember({ fieldName: 'channelId' }), 
        ],

        roleId: [
            sanitizeInput({ fieldName: 'roleId' }),
            notEmpty({ fieldName: 'roleId' }),
            toString({ fieldName: 'roleId' }),
            isMongoId({ fieldName: 'roleId' }),
            isRoleExistById({ fieldName: 'roleId' }),
        ],
    },
    
    // getMany: {
    //     channelId: [],
    // },
    
    update: {},
    
    delete: {},
    
    addUser: {},
    
    deleteUser: {},
};

export const RoleValidator = createValidator(roleValidators);