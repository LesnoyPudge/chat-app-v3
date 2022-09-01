import { IRoomModel } from '@models';
import { IRoom } from '@types';



interface IRoomDto {
    objectFromModel: (room: IRoomModel) => IRoom;
}

export const RoomDto: IRoomDto = {
    objectFromModel(room) {
        return {
            id: room._id.toString(),
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
            type: room.type,
            category: room.category.toString(),
            createdAt: room.createdAt.toString(),
            updatedAt: room.updatedAt.toString(),
        };
    },
};