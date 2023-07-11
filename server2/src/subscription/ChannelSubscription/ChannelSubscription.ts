import { sockets } from '@root';
import { Entities, promiseToBoolean } from '@shared';
import { customChains } from '@validators';
import { EntitySubscription } from '../EntitySubscription';



export const ChannelSubscription = new EntitySubscription<
    Entities.Channel.Default
>('Channel', sockets, async(userId, channelI) => {
    return promiseToBoolean(customChains.channelMember(userId, channelI)());
});