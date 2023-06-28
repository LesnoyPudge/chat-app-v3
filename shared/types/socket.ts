import { StrictOmit, ValueOf } from 'ts-essentials';
import { MODEL_NAMES, SOCKET_CLIENT_EVENT_NAMES, SOCKET_SERVER_EVENT_NAMES } from '../vars';
import { Prettify, Tokens, WithId } from './common';
import { Entities } from './entities';



export type SocketData = Prettify<
    Pick<Tokens, 'accessToken'> & 
    WithId & 
    { tokenData: Entities.User.Token; }
>;

type PartialNames = StrictOmit<typeof MODEL_NAMES, 'FILE'>;

type ToName<EntityName extends string, EventName extends string> = `${EntityName}_${EventName}`;

export type SocketClientEvents = Record<
    ToName<ValueOf<PartialNames>, ValueOf<typeof SOCKET_CLIENT_EVENT_NAMES>>,
    (entityId: string) => void
>;

export type SocketServerEvents = Prettify<
    Record<
        ToName<
            ValueOf<PartialNames>, 
            typeof SOCKET_SERVER_EVENT_NAMES.DELETE | 
            typeof SOCKET_SERVER_EVENT_NAMES.ERROR
        >,
        (entityId: string) => void
    > & Record<
        ToName<typeof MODEL_NAMES.CHANNEL, typeof SOCKET_SERVER_EVENT_NAMES.DATA>,
        (entityId: string, data: Partial<Entities.Channel.Default>) => void
    > & Record<
        ToName<typeof MODEL_NAMES.CHAT, typeof SOCKET_SERVER_EVENT_NAMES.DATA>,
        (entityId: string, data: Partial<Entities.Chat.Default>) => void
    > & Record<
        ToName<typeof MODEL_NAMES.MESSAGE, typeof SOCKET_SERVER_EVENT_NAMES.DATA>,
        (entityId: string, data: Partial<Entities.Message.Default>) => void
    > & Record<
        ToName<typeof MODEL_NAMES.PRIVATE_CHANNEL, typeof SOCKET_SERVER_EVENT_NAMES.DATA>,
        (entityId: string, data: Partial<Entities.PrivateChannel.Default>) => void
    > & Record<
        ToName<typeof MODEL_NAMES.ROLE, typeof SOCKET_SERVER_EVENT_NAMES.DATA>,
        (entityId: string, data: Partial<Entities.Role.Default>) => void
    > & Record<
        ToName<typeof MODEL_NAMES.ROOM, typeof SOCKET_SERVER_EVENT_NAMES.DATA>,
        (entityId: string, data: Partial<Entities.Room.Default>) => void
    > & Record<
        ToName<typeof MODEL_NAMES.USER, typeof SOCKET_SERVER_EVENT_NAMES.DATA>,
        (entityId: string, data: Partial<Entities.User.WithoutCredentials>) => void
    >
>;