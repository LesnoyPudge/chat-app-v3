import { ValueOf } from 'ts-essentials';
import { Entities } from './entities';



export interface Tokens {
    refreshToken: string;
    accessToken: string;
}

export type Status = 'online' | 'offline';

export type Id = string;

export type Timestamp = number;

export type Override<T, K extends keyof T, V> = Record<K, V>;

export type Prettify<T> = {
    [K in keyof T]: T[K]
// eslint-disable-next-line @typescript-eslint/ban-types
} & {};

export type ToType<T> = Prettify<T>;

export interface WithUserId {
    userId: Id;
}

export interface WithTargetId {
    targetId: Id;
}

export interface WithChannelId {
    channelId: Id;
}

export interface WithRoomId {
    roomId: Id;
}

export interface WithRoleId {
    roleId: Id;
}

export interface WithPrivateChannelId {
    privateChannelId: Id;
}

export interface WithChatId {
    chatId: Id;
}

export interface WithMessageId {
    messageId: Id;
}

export interface WithFileId {
    fileId: Id;
}

export interface UserWithTokens<User extends Partial<Entities.User.Default>> extends Tokens {
    user: User;
}

export interface WithId {
    id: Id;
}

export type SocketId = Id;

export type UserId = Id;

export type EntityId = Id;

export type PeerId = Id;