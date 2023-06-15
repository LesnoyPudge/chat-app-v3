import { sockets } from '@root';
import { Entities } from '@shared';
import { customChains } from '@validators';
import { EntitySubscription } from '../EntitySubscription';



export const MessageSubscription = new EntitySubscription<
    Entities.Message.Default
>(
    'Message',
    sockets,
    async(userId, messageId) => {
        return customChains.ableToReadMessage(userId, messageId)()
            .catch(() => false).then(() => true);
    },
);