import { RoomDto } from '@dtos';
import { RoomModel } from '@models';
import { subscription } from '@subscription';
import { AuthorizedServiceType, ICreateRoomRequest, IDeleteRoomRequest, IGetManyRoomsRequest, IGetOneRoomRequest, IRoom, IUpdateRoomRequest } from '@types';
import { ApiError, transactionContainer } from '@utils';
import { ChannelServiceHelpers } from '@services';



interface IRoomService {
    create: AuthorizedServiceType<ICreateRoomRequest, IRoom>;
    getOne: AuthorizedServiceType<IGetOneRoomRequest, IRoom>;
    // getMany: AuthorizedServiceType<IGetManyRoomsRequest, IRoom[]>;
    update: AuthorizedServiceType<IUpdateRoomRequest, IRoom>;
    delete: AuthorizedServiceType<IDeleteRoomRequest, IRoom>;
}

export const RoomService: IRoomService = {
    async create({ userId, channelId, name, identifier }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const room = new RoomModel({
                    name,
                    identifier,
                    channel: channelId,
                });
                
                await room.save(queryOptions());

                await ChannelServiceHelpers.addRoom({ channelId, roomId: room._id });
                
                const roomDto = RoomDto.objectFromModel(room);
                return roomDto;
            },
        );
    },

    async getOne({ userId, roomId }) {
        const room = await RoomModel.findById(roomId, {}, { lean: true });
        if (!room) throw ApiError.badRequest('Комната не найдена');

        const roomDto = RoomDto.objectFromModel(room);
        return roomDto;
    },

    // async getMany({ userId, roomIds }) {
    //     const rooms = await RoomModel.find({ _id: { $in: roomIds } }, {}, { lean: true });
    //     if (!rooms.length) {
    //         throw ApiError.badRequest('Комнаты не найдены');
    //     }

    //     const roomDtos = rooms.map((room) => {
    //         return RoomDto.objectFromModel(room);
    //     });

    //     return roomDtos;
    // },

    async update({ userId, roomId, newValues }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedRoom = await RoomModel.findByIdAndUpdate(
                    roomId,
                    newValues,
                    queryOptions({ new: true }),
                );
                if (!updatedRoom) throw ApiError.badRequest('Не удалось обновить комнату');

                const updatedRoomDto = RoomDto.objectFromModel(updatedRoom);

                onCommit(() => {
                    subscription.rooms.update({ entity: updatedRoomDto });
                });

                return updatedRoomDto;
            },
        );
    },

    async delete({ userId, roomId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const deletedRoom = await RoomModel.findByIdAndDelete(
                    roomId,
                    queryOptions({ new: true }),
                );
                if (!deletedRoom) throw ApiError.badRequest('Не удалось удалить комнату');
            
                await ChannelServiceHelpers.removeRoom({ roomId });

                const deletedRoomDto = RoomDto.objectFromModel(deletedRoom);
                
                onCommit(() => {
                    subscription.rooms.delete({ entityId: roomId });
                });
                
                return deletedRoomDto;
            },
        );
    },
};