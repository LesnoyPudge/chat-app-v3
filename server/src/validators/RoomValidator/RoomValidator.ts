import { ICreateRoomRequest, IGetOneRoomRequest, IUpdateRoomRequest, IDeleteRoomRequest } from '@types';
import { createValidator, ObjectToValidatorsChain } from '../createValidator';
import { isCategoryExist, isChannelExistById, isImChannelAdministrator, isImChannelMember, isImChannelOwner, isMongoId, isRoomExistById, notEmpty, reject, sanitizeInput, toString } from '../validationChains';



interface IRoomValidators {
    create: ObjectToValidatorsChain<ICreateRoomRequest>;
    getOne: ObjectToValidatorsChain<IGetOneRoomRequest>;
    update: ObjectToValidatorsChain<IUpdateRoomRequest>;
    delete: ObjectToValidatorsChain<IDeleteRoomRequest>;
}

const roomValidators: IRoomValidators = {
    create: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImChannelAdministrator({ fieldName: 'channelId' }),
            isImChannelOwner({ fieldName: 'channelId' }),
            reject({ fieldName: 'channelId', errorMessage: 'Отсутствует разрешение на создание комнат' }),
        ],

        name: [],
    },
    
    getOne: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImChannelMember({ fieldName: 'channelId' }),
        ],

        roomId: [],
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
            reject({ fieldName: 'channelId', errorMessage: 'Отсутствует разрешение на изменение комнат' }),
        ],

        roomId: [
            sanitizeInput({ fieldName: 'roomId' }),
            notEmpty({ fieldName: 'roomId' }),
            toString({ fieldName: 'roomId' }),
            isMongoId({ fieldName: 'roomId' }),
            isRoomExistById({ fieldName: 'roomId' }),
        ],
        
        category: [
            sanitizeInput({ fieldName: 'category' }),
            notEmpty({ fieldName: 'category' }),
            toString({ fieldName: 'category' }),
            isMongoId({ fieldName: 'category' }),
            isCategoryExist({ fieldName: 'category', extraFields: { channelIdPath: 'body.channelId' } }),
        ],
        
        name: [
            sanitizeInput({ fieldName: 'name' }),
            notEmpty({ fieldName: 'name' }),
            toString({ fieldName: 'name' }),
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
            reject({ fieldName: 'channelId', errorMessage: 'Отсутствует разрешение на удаление комнат' }),
        ],

        roomId: [
            sanitizeInput({ fieldName: 'roomId' }),
            notEmpty({ fieldName: 'roomId' }),
            toString({ fieldName: 'roomId' }),
            isMongoId({ fieldName: 'roomId' }),
            isRoomExistById({ fieldName: 'roomId' }),
        ],
    },
};

export const RoomValidator = createValidator(roomValidators);