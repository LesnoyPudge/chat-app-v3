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
            attachments: message.attachments.map((attachmentId) => {
                return attachmentId.toString();
            }),
            isChanged: message.isChanged,
            isDeleted: message.isDeleted,
            respondOn: message.respondOn.map((messageId) => {
                return messageId.toString();
            }),
            createdAt: message.createdAt.getMilliseconds(),
            updatedAt: message.updatedAt.getMilliseconds(),
        };
    },
};