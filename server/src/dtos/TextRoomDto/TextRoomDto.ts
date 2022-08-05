import { ITextRoomModel } from '@models';
import { ITextRoom } from '@types';



interface ITextRoomDto {
    objectFromModel: (room: ITextRoomModel) => ITextRoom;
}

export const TextRoomDto: ITextRoomDto = {
    objectFromModel(room) {
        return {
            id: room._id.toString(),
            identifier: room.identifier,
            name: room.name,
            channel: room.channel.toString(),
            chat: room.chat.toString(),
            whiteList: {
                users: room.whiteList.users.map((userId) => {
                    return userId.toString();
                }),
                roles: room.whiteList.roles.map((roleId) => {
                    return roleId.toString();
                }),
            },
            createdAt: room.createdAt.toString(),
            updatedAt: room.updatedAt.toString(),
        };
    },
};