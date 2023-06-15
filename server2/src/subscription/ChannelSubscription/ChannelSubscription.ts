import { sockets } from '@root';
import { Entities } from '@shared';
import { customChains } from '@validators';
import { EntitySubscription } from '../EntitySubscription';



export const ChannelSubscription = new EntitySubscription<
    Entities.Channel.Default
>('Channel', sockets, async(userId, channelI) => {
    return customChains.channelMember(userId, channelI)()
        .catch(() => false).then(() => true);
});