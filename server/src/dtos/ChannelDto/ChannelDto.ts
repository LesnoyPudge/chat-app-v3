import { IChannel } from '@types';
import { IChannelModel } from '@models';



interface IChannelDto {
    objectFromModel: (channel: IChannelModel) => IChannel;
}

export const ChannelDto: IChannelDto = {
    objectFromModel(channel) {
        return {
            id: channel._id.toString(),
            identifier: channel.identifier,
            avatar: channel.avatar,
            name: channel.name,
            owner: channel.owner.toString(),
            isPrivate: channel.isPrivate,
            members: channel.members.map((memberId) => {
                return memberId.toString();
            }),
            textRooms: channel.textRooms.map((textRoomId) => {
                return textRoomId.toString();
            }),
            roles: channel.roles.map((roleId) => {
                return roleId.toString();
            }),
            banList: channel.banList.map(({ user, reason }) => {
                return {
                    user: user.toString(),
                    reason,
                };
            }),
            invitations: channel.invitations.map((invitation) => {
                return {
                    creator: invitation.creator.toString(),
                    code: invitation.code,
                    expiryDate: invitation.expiryDate.toString(),
                    createdAt: invitation.createdAt.toString(),
                };
            }),
            createdAt: channel.createdAt.toString(),
            updatedAt: channel.updatedAt.toString(),
        };
    },
};