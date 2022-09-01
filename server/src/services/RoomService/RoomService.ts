import { RoomDto } from '@dtos';
import { RoomModel } from '@models';
import { subscription } from '@subscription';
import { AuthorizedServiceType, ICreateRoomRequest, IDeleteRoomRequest, IGetOneRoomRequest, IRoom, IUpdateRoomRequest } from '@types';
import { ApiError, transactionContainer } from '@utils';
import { ChannelServiceHelpers } from '@services';



interface IRoomService {
    create: AuthorizedServiceType<ICreateRoomRequest, IRoom>;
    getOne: AuthorizedServiceType<IGetOneRoomRequest, IRoom>;
    update: AuthorizedServiceType<IUpdateRoomRequest, IRoom>;
    delete: AuthorizedServiceType<IDeleteRoomRequest, IRoom>;
}

export const RoomService: IRoomService = {
    async create({ userId, channelId, name }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const room = new RoomModel({
                    name,
                    channel: channelId,
                });
                
                await room.save(queryOptions());

                await ChannelServiceHelpers.addRoom({ channelId, roomId: room._id });
                
                return RoomDto.objectFromModel(room);
            },
        );
    },

    async getOne({ userId, roomId }) {
        const room = await RoomModel.findById(roomId, {}, { lean: true });
        return RoomDto.objectFromModel(room);
    },

    async update({ userId, roomId, category, name }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedRoom = await RoomModel.findByIdAndUpdate(
                    roomId,
                    { $set: { category, name } },
                    queryOptions({ new: true }),
                );

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