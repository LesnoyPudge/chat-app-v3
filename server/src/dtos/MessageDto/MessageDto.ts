import { IMessageModel } from '@models';
import { IMessage } from '@types';



interface IMessageDto {
    objectFromModel: (message: IMessageModel) => IMessage;
}

export const MessageDto: IMessageDto = {
    objectFromModel(message) {
        return {
            id: message._id.toString(),
            chat: message.chat.toString(),
            user: message.user.toString(),
            content: message.content,
            attachedImages: message.attachedImages,
            isChanged: message.isChanged,
            isDeleted: message.isDeleted,
            createdAt: message.createdAt.toString(),
            updatedAt: message.updatedAt.toString(),
        };
    },
};