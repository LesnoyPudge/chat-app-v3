import { sockets } from '@root';
import { RoomServiceHelpers } from '@services';
import { Entities } from '@shared';
import { customChains } from '@validators';
import { EntitySubscription } from '../EntitySubscription';



export const RoomSubscription = new EntitySubscription<
    Entities.Room.Default
>(
    'Room',
    sockets,
    async(userId, roomId) => {
        const room = await RoomServiceHelpers.getOne({ id: roomId });
        if (!room) return Promise.resolve(false);

        return customChains.channelMember(userId, room.channel)()
            .catch(() => false).then(() => true);
    },
);