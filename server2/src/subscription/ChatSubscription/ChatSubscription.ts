import { sockets } from '@root';
import { Entities } from '@shared';
import { customChains } from '@validators';
import { EntitySubscription } from '../EntitySubscription';



export const ChatSubscription = new EntitySubscription<
    Entities.Chat.Default
>('Chat', sockets, async(userId, chatId) => {
    return customChains.ableToGetChat(userId, chatId)()
        .catch(() => false).then(() => true);
});