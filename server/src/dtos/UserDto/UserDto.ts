import { IUser } from '@types';
import { IUserModel } from '@models';



interface IUserDto {
    objectFromModel: (user: IUserModel) => IUser;
    defaultPreset: (user: Partial<IUser>) => IUser; // TO CHANGE: THIS SHOULD RETURN PARTIAL PUBLIC INFO ABOUT USER
}

export const UserDto: IUserDto = {
    objectFromModel(user) {
        return {
            id: user._id.toString(),
            login: user.login,
            username: user.username,
            password: user.password,
            avatar: user.avatar,
            email: user.email,
            extraStatus: user.extraStatus,
            activationCode: user.activationCode,
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
            accessCode: {
                code: user.accessCode.code,
                expiryDate: user.accessCode.expiryDate.toString(),
            },
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
    defaultPreset(user) {
        return {
            id: user?.id,
            login: user?.login,
            username: user?.username,
            password: user?.password,
            avatar: user?.avatar,
            email: user?.email,
            extraStatus: user?.extraStatus,
            activationCode: user?.activationCode,
            isActivated: user?.isActivated,
            settings: user?.settings,
            blockList: user?.blockList.map((blockedUserId) => {
                return blockedUserId.toString();
            }),
            channels: user?.channels.map((channelId) => {
                return channelId.toString();
            }),
            privateChannels: user?.privateChannels.map((privateChannelId) => {
                return privateChannelId.toString();
            }),
            accessCode: {
                code: user?.accessCode.code,
                expiryDate: user?.accessCode.expiryDate.toString(),
            },
            friendRequests: {
                incoming: user?.friendRequests.incoming.map((incomingRequest) => {
                    return {
                        from: incomingRequest.from.toString(),
                        createdAt: incomingRequest.createdAt.toString(),
                    };
                }),
                outgoing: user?.friendRequests.outgoing.map((outgoingRequest) => {
                    return {
                        to: outgoingRequest.to.toString(),
                        createdAt: outgoingRequest.createdAt.toString(),
                    };
                }),
            },
            createdAt: user?.createdAt,
            updatedAt: user?.updatedAt,
        };
    },
};