import { sockets } from '@root';
import { Entities, promiseToBoolean } from '@shared';
import { customChains } from '@validators';
import { EntitySubscription } from '../EntitySubscription';



export const ChatSubscription = new EntitySubscription<
    Entities.Chat.Default
>('Chat', sockets, async(userId, chatId) => {
    return promiseToBoolean(customChains.ableToGetChat(userId, chatId)());
});