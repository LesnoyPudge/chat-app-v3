import { RoomModel, modelWithId, transactionContainer } from '@database';
import { ApiError } from '@errors';
import { ChannelServiceHelpers, ChatServiceHelpers } from '@services';
import { Endpoints, MODEL_NAMES } from '@shared';
import { RoomSubscription } from '@subscription';
import { AuthorizedService } from '@types';



interface RoomService {
    [Endpoints.V1.Room.Create.ActionName]: AuthorizedService<
        Endpoints.V1.Room.Create.RequestBody,
        Endpoints.V1.Room.Create.Response
    >;
    [Endpoints.V1.Room.GetOne.ActionName]: AuthorizedService<
        Endpoints.V1.Room.GetOne.RequestBody,
        Endpoints.V1.Room.GetOne.Response
    >;
    [Endpoints.V1.Room.Update.ActionName]: AuthorizedService<
        Endpoints.V1.Room.Update.RequestBody,
        Endpoints.V1.Room.Update.Response
    >;
    [Endpoints.V1.Room.Delete.ActionName]: AuthorizedService<
        Endpoints.V1.Room.Delete.RequestBody,
        Endpoints.V1.Room.Delete.Response
    >;
}

export const RoomService: RoomService = {
    async create(_, { channelId, name }) {
        return transactionContainer(
            async({ session }) => {
                const newRoom = modelWithId(new RoomModel({
                    name,
                    channel: channelId,
                }));

                const chat = await ChatServiceHelpers.create({
                    owner: MODEL_NAMES.ROOM,
                    ownerId: newRoom.id,
                });

                newRoom.chat = chat.id;

                const room = await newRoom.save({ session });

                await ChannelServiceHelpers.addRoom({ channelId, roomId: room.id });

                return room;
            },
        );
    },

    async getOne(_, { roomId }) {
        const room = await RoomModel.findOne({ id: roomId }).lean();

        if (!room) throw ApiError.internal();

        return room;
    },

    async update(_, { roomId, ...newValues }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedRoom = await RoomModel.findOneAndUpdate(
                    { id: roomId },
                    newValues,
                    { new: true },
                ).session(session).lean();

                if (!updatedRoom) throw ApiError.internal();

                onCommit(() => {
                    RoomSubscription.update(updatedRoom);
                });

                return updatedRoom;
            },
        );
    },

    async delete(_, { roomId }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const deletedRoom = await RoomModel.findOneAndDelete(
                    { id: roomId },
                    { new: true },
                ).session(session).lean();

                if (!deletedRoom) throw ApiError.internal();

                await ChannelServiceHelpers.removeRoom({ roomId });

                onCommit(() => {
                    RoomSubscription.delete(deletedRoom.id);
                });
            },
        );
    },
};