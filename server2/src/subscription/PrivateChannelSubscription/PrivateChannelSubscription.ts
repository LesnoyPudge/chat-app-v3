import { sockets } from '@root';
import { Entities, promiseToBoolean } from '@shared';
import { customChains } from '@validators';
import { EntitySubscription } from '../EntitySubscription';



export const PrivateChannelSubscription = new EntitySubscription<
    Entities.PrivateChannel.Default
>(
    'PrivateChannel',
    sockets,
    async(userId, privateChannelId) => {
        return promiseToBoolean(customChains.privateChannelMember(userId, privateChannelId)());
    },
);