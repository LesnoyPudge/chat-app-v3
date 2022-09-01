import { ICreatePrivateChannelRequest, IGetOnePrivateChannelRequest, ILeavePrivateChannelRequest } from '@types';
import { createValidator, ObjectToValidatorsChain } from '../createValidator';
import { isImPrivateChannelMember, isMongoId, isntImInBlockList, isntPrivateChannelExistByTargetId, isPrivateChannelExist, isUserExistById, notEmpty, sanitizeInput, toString } from '../validationChains';



interface IPrivateChannelValidators {
    create: ObjectToValidatorsChain<ICreatePrivateChannelRequest>;
    getOne: ObjectToValidatorsChain<IGetOnePrivateChannelRequest>;
    leave: ObjectToValidatorsChain<ILeavePrivateChannelRequest>;
}

const privateChannelValidators: IPrivateChannelValidators = {
    create: {
        targetId: [
            sanitizeInput({ fieldName: 'targetId' }),
            notEmpty({ fieldName: 'targetId' }),
            toString({ fieldName: 'targetId' }),
            isMongoId({ fieldName: 'targetId' }),
            isUserExistById({ fieldName: 'targetId' }),
            isntImInBlockList({ fieldName: 'targetId' }),
            isntPrivateChannelExistByTargetId({ fieldName: 'targetId' }),
        ],
    },
    
    getOne: {
        privateChannelId: [
            sanitizeInput({ fieldName: 'privateChannelId' }),
            notEmpty({ fieldName: 'privateChannelId' }),
            toString({ fieldName: 'privateChannelId' }),
            isMongoId({ fieldName: 'privateChannelId' }),
            isPrivateChannelExist({ fieldName: 'privateChannelId' }),
            isImPrivateChannelMember({ fieldName: 'privateChannelId' }),
        ],
    },
    
    leave: {
        privateChannelId: [
            sanitizeInput({ fieldName: 'privateChannelId' }),
            notEmpty({ fieldName: 'privateChannelId' }),
            toString({ fieldName: 'privateChannelId' }),
            isMongoId({ fieldName: 'privateChannelId' }),
            isPrivateChannelExist({ fieldName: 'privateChannelId' }),
            isImPrivateChannelMember({ fieldName: 'privateChannelId' }),
        ],
    },
};

export const PrivateChannelValidator = createValidator(privateChannelValidators);