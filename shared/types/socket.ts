import { ValueOf } from 'ts-essentials';
import { SOCKET_CLIENT_EVENT_NAMES, SOCKET_SERVER_EVENT_NAMES, SUBSCRIBABLE_ENTITIES } from '../vars';
import { Prettify, Tokens, WithId } from './common';
import { Entities } from './entities';



export type SocketData = Prettify<Pick<Tokens, 'accessToken'> & WithId>;

type SubscribableEntities = typeof SUBSCRIBABLE_ENTITIES;

type ToName<EntityName extends string, EventName extends string> = `${EntityName}_${EventName}`;

export type SocketClientEvents = Record<
    ToName<ValueOf<SubscribableEntities>, ValueOf<typeof SOCKET_CLIENT_EVENT_NAMES>>,
    (entityId: string) => void
>;

export type SocketServerEvents = Prettify<
    Record<
        ToName<
            ValueOf<SubscribableEntities>, 
            typeof SOCKET_SERVER_EVENT_NAMES.DELETE | 
            typeof SOCKET_SERVER_EVENT_NAMES.ERROR
        >,
        (entityId: string) => void
    > & Record<
        ToName<SubscribableEntities['CHANNEL'], typeof SOCKET_SERVER_EVENT_NAMES.DATA>,
        (entityId: string, data: Partial<Entities.Channel.Default>) => void
    > & Record<
        ToName<SubscribableEntities['CHAT'], typeof SOCKET_SERVER_EVENT_NAMES.DATA>,
        (entityId: string, data: Partial<Entities.Chat.Default>) => void
    > & Record<
        ToName<SubscribableEntities['MESSAGE'], typeof SOCKET_SERVER_EVENT_NAMES.DATA>,
        (entityId: string, data: Partial<Entities.Message.Default>) => void
    > & Record<
        ToName<SubscribableEntities['PRIVATE_CHANNEL'], typeof SOCKET_SERVER_EVENT_NAMES.DATA>,
        (entityId: string, data: Partial<Entities.PrivateChannel.Default>) => void
    > & Record<
        ToName<SubscribableEntities['ROLE'], typeof SOCKET_SERVER_EVENT_NAMES.DATA>,
        (entityId: string, data: Partial<Entities.Role.Default>) => void
    > & Record<
        ToName<SubscribableEntities['ROOM'], typeof SOCKET_SERVER_EVENT_NAMES.DATA>,
        (entityId: string, data: Partial<Entities.Room.Default>) => void
    > & Record<
        ToName<SubscribableEntities['USER'], typeof SOCKET_SERVER_EVENT_NAMES.DATA>,
        (entityId: string, data: Partial<Entities.User.WithoutCredentials>) => void
    >
>;