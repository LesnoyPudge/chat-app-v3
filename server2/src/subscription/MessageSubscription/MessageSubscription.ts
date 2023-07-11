import { sockets } from '@root';
import { Entities, promiseToBoolean } from '@shared';
import { customChains } from '@validators';
import { EntitySubscription } from '../EntitySubscription';



export const MessageSubscription = new EntitySubscription<
    Entities.Message.Default
>(
    'Message',
    sockets,
    async(userId, messageId) => {
        return promiseToBoolean(customChains.ableToReadMessage(userId, messageId)());
    },
);