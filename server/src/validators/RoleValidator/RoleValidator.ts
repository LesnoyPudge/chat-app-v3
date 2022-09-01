import { ICreateRoleRequest, IGetOneRoleRequest, IUpdateRoleRequest, IDeleteRoleRequest, IAddUserRoleRequest, IDeleteUserRoleRequest } from '@types';
import { createValidator, ObjectToValidatorsChain } from '../createValidator';
import { isBase64Url, isChannelExistById, isImChannelAdministrator, isImChannelMember, isImChannelOwner, isMongoId, isntRoleDefault, isntRoleHasUser, isRoleColor, isRoleExistById, isRoleHasUser, isUserExistById, isValidRoleOrder, notEmpty, nullable, reject, sanitizeInput, toBoolean, toInt, toString } from '../validationChains';



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
    
    update: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImChannelAdministrator({ fieldName: 'channelId' }),
            isImChannelOwner({ fieldName: 'channelId' }),
            reject({ fieldName: 'channelId', errorMessage: 'Нет разрешения на обновление ролей' }),
        ],

        roleId: [
            sanitizeInput({ fieldName: 'roleId' }),
            notEmpty({ fieldName: 'roleId' }),
            toString({ fieldName: 'roleId' }),
            isMongoId({ fieldName: 'roleId' }),
            isRoleExistById({ fieldName: 'roleId' }),
        ],
        
        color: [
            nullable({ fieldName: 'color' }),
            sanitizeInput({ fieldName: 'color' }),
            notEmpty({ fieldName: 'color' }),
            toString({ fieldName: 'color' }),
            isRoleColor({ fieldName: 'color' }),
        ],

        name: [
            nullable({ fieldName: 'name' }),
            sanitizeInput({ fieldName: 'name' }),
            notEmpty({ fieldName: 'name' }),
            toString({ fieldName: 'name' }),
        ],

        order: [
            nullable({ fieldName: 'order' }),
            sanitizeInput({ fieldName: 'order' }),
            notEmpty({ fieldName: 'order' }),
            toInt({ fieldName: 'order' }),
            isValidRoleOrder({ fieldName: 'order' }),
        ],

        permissions: [
            nullable({ fieldName: 'permissions' }),
            sanitizeInput({ fieldName: 'permissions' }),
            notEmpty({ fieldName: 'permissions' }),

            sanitizeInput({ fieldName: 'permissions.*' }),
            notEmpty({ fieldName: 'permissions.*' }),
            toBoolean({ fieldName: 'permissions.*' }),
        ],

        image: [
            nullable({ fieldName: 'image' }),
            nullable({ fieldName: 'image.filename' }),
            nullable({ fieldName: 'image.base64url' }),

            sanitizeInput({ fieldName: 'image' }),
            sanitizeInput({ fieldName: 'image.filename' }),
            sanitizeInput({ fieldName: 'image.base64url' }),

            notEmpty({ fieldName: 'image' }),
            notEmpty({ fieldName: 'image.filename' }),
            notEmpty({ fieldName: 'image.base64url' }),

            toString({ fieldName: 'image.filename' }),
            toString({ fieldName: 'image.base64url' }),

            isBase64Url({ fieldName:  'image.base64url' }),
        ],
    },
    
    delete: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImChannelAdministrator({ fieldName: 'channelId' }),
            isImChannelOwner({ fieldName: 'channelId' }),
            reject({ fieldName: 'channelId', errorMessage: 'Нет разрешения на удаление ролей' }),
        ],
        
        roleId: [
            sanitizeInput({ fieldName: 'roleId' }),
            notEmpty({ fieldName: 'roleId' }),
            toString({ fieldName: 'roleId' }),
            isMongoId({ fieldName: 'roleId' }),
            isRoleExistById({ fieldName: 'roleId' }),
            isntRoleDefault({ fieldName: 'roleId' }),
        ],
    },
    
    addUser: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImChannelAdministrator({ fieldName: 'channelId' }),
            isImChannelOwner({ fieldName: 'channelId' }),
            reject({ fieldName: 'channelId', errorMessage: 'Нет разрешения на управление ролями' }),
        ],

        roleId: [
            sanitizeInput({ fieldName: 'roleId' }),
            notEmpty({ fieldName: 'roleId' }),
            toString({ fieldName: 'roleId' }),
            isMongoId({ fieldName: 'roleId' }),
            isRoleExistById({ fieldName: 'roleId' }),
            isntRoleHasUser({ fieldName: 'roleId', extraFields: { targetIdPath: 'body.targetId' } }),
        ],

        targetId: [
            sanitizeInput({ fieldName: 'targetId' }),
            notEmpty({ fieldName: 'targetId' }),
            toString({ fieldName: 'targetId' }),
            isMongoId({ fieldName: 'targetId' }),
            isUserExistById({ fieldName: 'targetId' }),
        ],
    },
    
    deleteUser: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImChannelAdministrator({ fieldName: 'channelId' }),
            isImChannelOwner({ fieldName: 'channelId' }),
            reject({ fieldName: 'channelId', errorMessage: 'Нет разрешения на управление ролями' }),
        ],

        roleId: [
            sanitizeInput({ fieldName: 'roleId' }),
            notEmpty({ fieldName: 'roleId' }),
            toString({ fieldName: 'roleId' }),
            isMongoId({ fieldName: 'roleId' }),
            isRoleExistById({ fieldName: 'roleId' }),
            isRoleHasUser({ fieldName: 'roleId', extraFields: { targetIdPath: 'body.targetId' } }),
        ],

        targetId: [
            sanitizeInput({ fieldName: 'targetId' }),
            notEmpty({ fieldName: 'targetId' }),
            toString({ fieldName: 'targetId' }),
            isMongoId({ fieldName: 'targetId' }),
            isUserExistById({ fieldName: 'targetId' }),
        ],
    },
};

export const RoleValidator = createValidator(roleValidators);