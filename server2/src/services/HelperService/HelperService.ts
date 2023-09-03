import { Endpoints, promiseToBoolean } from '@shared';
import { AuthorizedService } from '@types';
import { ChannelServiceHelpers, RoomServiceHelpers } from '@services';
import { ApiError } from '@errors';
import { customChains } from '@validators';



interface HelperService {
    [Endpoints.V1.Helper.GetAvailableTextRoomIds.ActionName]: AuthorizedService<
        Endpoints.V1.Helper.GetAvailableTextRoomIds.RequestBody,
        Endpoints.V1.Helper.GetAvailableTextRoomIds.Response
    >
}

export const HelperService: HelperService = {
    async getAvailableTextRoomIds({ id }, { channelId }) {
        const channel = await ChannelServiceHelpers.getOne({ id: channelId });
        if (!channel) throw ApiError.internal();

        const rooms = await RoomServiceHelpers.getMany({ channel: channelId });

        const textRooms = rooms.filter((room) => room.type === 'text');

        const availableRooms = await Promise.all(textRooms.map(async(room) => {
            const isAvailable = await promiseToBoolean(
                customChains.ableToFullyAccessRoom(id, room.id)(),
            );

            if (isAvailable) return room.id;

            return undefined;
        })).then((v) => v.filter(Boolean));

        return availableRooms;
    },
};