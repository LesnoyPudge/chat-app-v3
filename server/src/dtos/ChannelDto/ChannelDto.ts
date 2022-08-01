import { IChannel } from '@types';
import { IChannelModel } from '@models';



interface IChannelDto {
    objectFromModel: (user: IChannelModel) => IChannel;
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
            invitations: channel.invitations.map((invitationId) => {
                return invitationId.toString();
            }),
            members: channel.members.map((memberId) => {
                return memberId.toString();
            }),
            rooms: channel.rooms.map((roomId) => {
                return roomId.toString();
            }),
            roles: channel.roles.map(({ role, users }) => {
                return {
                    role: role.toString(),
                    users: users.map((userId) => {
                        return userId.toString();
                    }),
                };
            }),
            banList: channel.banList.map(({ user, reason }) => {
                return {
                    user: user.toString(),
                    reason,
                };
            }),
            createdAt: channel.createdAt,
            updatedAt: channel.updatedAt,
        };
    },
};