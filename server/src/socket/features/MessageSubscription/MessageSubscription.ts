import { MessageService } from '@services';
import { socket } from '@socket';
import { IMessage } from '@types';



interface IMessageEntity extends IMessage {
    subscribers: Set<string>;
}

interface IMessageEntities {
    [id: string]: IMessageEntity;
}

interface IMessageSubscription {
    messages: IMessageEntities,
    subscribe: ({ userId, messageId }: {userId: string, messageId: string}) => void;
    unsubscribe: ({ userId, messageId }: {userId: string, messageId: string}) => void;
    update: ({ userId, message }: {userId: string, message: IMessage}) => void;
}

export const MessageSubscription: IMessageSubscription = {
    messages: {},

    async subscribe({ userId, messageId }) {
        console.log(userId + ' subscribed on message: ' + messageId);
        try {
            const isExist = isMessageEntityExist(messageId);
            if (!isExist) {
                const target = await MessageService.getOne({ userId, messageId });
                createMessageEntity(target);
            } 

            subscribeOn({ messageId, userId });
            sendMessageEntity({ messageId, to: userId });
        } catch (error) {
            console.log('error during subscribe: ', error);
        }
    },

    unsubscribe({ userId, messageId }) {
        console.log(userId + ' unsubscribed from message: ' + messageId);
        const isExist = isMessageEntityExist(messageId);
        if (!isExist) return;

        unsubscribeFrom({ userId, messageId });
        deleteUserMessage(messageId);
    },

    update({ userId, message }) {
        console.log('message:', message.id, 'updated by:', userId);
        const isExist = isMessageEntityExist(message.id);
        if (!isExist) {
            createMessageEntity(message);
            // subscribeOn({ messageId: message.id, userId });
            return;
        }

        updateMessageEntity(message);
        const subscribers = getSubscribersArray(message.id);
        sendMessageEntity({ messageId: message.id, to: subscribers });
    },
};

const isMessageEntityExist = (messageId: string) => {
    return !!MessageSubscription.messages[messageId];
};

const createMessageEntity = (message: IMessage) => {
    if (isMessageEntityExist(message.id)) return;

    MessageSubscription.messages[message.id] = {
        ...message,
        subscribers: new Set(),
    };
};

const subscribeOn = ({ messageId, userId }: {messageId: string, userId: string}) => {
    if (!isMessageEntityExist(messageId)) return;
    
    MessageSubscription.messages[messageId].subscribers.add(userId);
    console.log('subscribers count:', MessageSubscription.messages[messageId].subscribers.size);
};

const unsubscribeFrom = ({ messageId, userId }: {messageId: string, userId: string}) => {
    if (!isMessageEntityExist(messageId)) return;

    MessageSubscription.messages[messageId].subscribers.delete(userId);
};

const deleteUserMessage = (messageId: string) => {
    if (!isMessageEntityExist(messageId)) return;

    const target = MessageSubscription.messages[messageId];
    const isZeroSubscribers = target.subscribers.size === 0;
    console.log('subscribers left:', target.subscribers.size);
    if (isZeroSubscribers) delete MessageSubscription.messages[messageId];
};

const sendMessageEntity = ({ messageId, to }: {messageId: string, to: string | string[]}) => {
    console.log('message entity send to:', to);
    
    socket.events.sendMessageSubscription({ 
        to, 
        message: MessageSubscription.messages[messageId], 
    });
};

const updateMessageEntity = (message: IMessage) => {
    if (!isMessageEntityExist(message.id)) return;
    MessageSubscription.messages[message.id] = Object.assign(MessageSubscription.messages[message.id], message);
};

const getSubscribersArray = (messageId: string) => {
    return Array.from(MessageSubscription.messages[messageId].subscribers);
};