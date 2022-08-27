import { IUser, IUserPreview } from '@types';
import { IUserModel } from '@models';



interface IUserDto {
    objectFromModel: (user: IUserModel) => IUser;
    preview: (user: Partial<IUser & {status: 'online' | 'offline'}>) => IUserPreview;
}

export const UserDto: IUserDto = {
    objectFromModel(user) {
        return {
            id: user._id.toString(),
            login: user.login,
            username: user.username,
            avatar: user.avatar,
            email: user.email,
            extraStatus: user.extraStatus,
            isActivated: user.isActivated,
            settings: user.settings,
            blockList: user.blockList.map((blockedUserId) => {
                return blockedUserId.toString();
            }),
            channels: user.channels.map((channelId) => {
                return channelId.toString();
            }),
            privateChannels: user.privateChannels.map((privateChannelId) => {
                return privateChannelId.toString();
            }),
            friendRequests: {
                incoming: user.friendRequests.incoming.map((incomingRequest) => {
                    return {
                        from: incomingRequest.from.toString(),
                        createdAt: incomingRequest.createdAt.toString(),
                    };
                }),
                outgoing: user.friendRequests.outgoing.map((outgoingRequest) => {
                    return {
                        to: outgoingRequest.to.toString(),
                        createdAt: outgoingRequest.createdAt.toString(),
                    };
                }),
            },
            createdAt: user.createdAt.toString(),
            updatedAt: user.updatedAt.toString(),
        };
    },
    
    preview(user) {
        return {
            id: user.id,
            login: user.login,
            username: user.username,
            avatar: user.avatar,
            extraStatus: user.extraStatus,
            status: user.status,
        };
    },
};