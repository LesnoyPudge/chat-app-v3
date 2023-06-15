import { sockets } from '@root';
import { Entities } from '@shared';
import { customChains } from '@validators';
import { EntitySubscription } from '../EntitySubscription';



export const PrivateChannelSubscription = new EntitySubscription<
    Entities.PrivateChannel.Default
>(
    'PrivateChannel',
    sockets,
    async(userId, privateChannelId) => {
        return customChains.privateChannelMember(userId, privateChannelId)()
            .catch(() => false).then(() => true);
    },
);