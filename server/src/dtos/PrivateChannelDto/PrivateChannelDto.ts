import { IPrivateChannelModel } from '@models';
import { IPrivateChannel } from '@types';



interface IPrivateChannelDto {
    objectFromModel: (privateChannel: IPrivateChannelModel) => IPrivateChannel;
}

export const PrivateChannelDto: IPrivateChannelDto = {
    objectFromModel(privateChannel) {
        return {
            id: privateChannel._id.toString(),
            members: privateChannel.members.map((memberId) => {
                return memberId.toString();
            }),
            activeMembers: privateChannel.activeMembers.map((activeMemberId) => {
                return activeMemberId.toString();
            }),
            chat: {
                id: privateChannel.chat._id.toString(),
                messages: privateChannel.chat.messages.map((messageId) => {
                    return messageId.toString();
                }),
            },
            createdAt: privateChannel.createdAt.toString(),
            updatedAt: privateChannel.updatedAt.toString(),
        };
    },
};