import { MODEL_NAMES } from '../vars';
import { Id, PeerId, Prettify, StrictOmit, Timestamp, UserId } from './index';



export module Entities {
    export module User {
        export interface Credentials {
            password: string;
            refreshToken: string;
            accessCode: {
                code: string;
                expiresAt: Timestamp;
            }
        }

        interface Settings {
            settings: {
                theme: 'auto' | 'dark' | 'light';
                fontSize: 12 | 14 | 16 | 18 | 20;
                messageGroupSpacing: 16 | 20;
            };
        }

        export type Status = 'online' | 'offline';

        export interface WithStatus {
            status: Status;
        }

        export type ExtraStatus = 'default' | 'afk' | 'dnd' | 'invisible'

        export interface Default extends Credentials, Settings {
            id: Id;
            login: string;
            username: string;
            avatarId: Id;
            email: string | null;
            extraStatus: ExtraStatus;
            isActivated: boolean;
            friends: Id[];
            blocked: Id[];
            channels: Id[];
            privateChannels: {
                id: Id,
                hidden: boolean;
            }[];
            friendRequests: {
                incoming: {
                    from: Id;
                    createdAt: Timestamp;
                }[];
                outgoing: {
                    to: Id;
                    createdAt: Timestamp;
                }[];
            };
            isDeleted: boolean;
            createdAt: Timestamp;
        }

        export type WithoutCredentials = Prettify<
            StrictOmit<User.Default, keyof Credentials> &
            WithStatus
        >;

        export type Preview = Pick<
            User.WithoutCredentials,
            'id' | 'avatarId' | 'login' | 'extraStatus' |
            'username' | 'isDeleted' | 'blocked' | 'status'
        >;

        export type Token = Pick<
            User.Default,
            'id' | 'password' | 'email'
        >;
    }

    export module Channel {
        export interface Default {
            id: Id;
            identifier: string;
            avatar: Id | null;
            name: string;
            owner: Id;
            isPrivate: boolean;
            members: Id[];
            rooms: Id[];
            roles: Id[];
            banned: {
                user: Id;
                reason: string | null;
            }[];
            invitations: {
                creator: Id;
                code: string;
                expiresAt: Timestamp | null;
                createdAt: Timestamp;
            }[];
            createdAt: Timestamp;
        }
    }

    export module Room {
        export interface Default {
            id: Id;
            name: string;
            channel: Id;
            isPrivate: boolean;
            chat: Id;
            conversation: Id;
            whiteList: {
                users: Id[];
                roles: Id[];
            };
            type: 'voice' | 'text';
            createdAt: Timestamp;
        }
    }

    export module Message {
        export interface Default {
            id: Id;
            chat: Id;
            user: Id;
            content: string;
            attachments: File.Attachment[];
            isChanged: boolean;
            isDeleted: boolean;
            createdAt: Timestamp;
            updatedAt: Timestamp;
        }
    }

    export module Role {
        export interface Default {
            id: Id;
            name: string;
            channel: Id;
            users: Id[];
            isDefault: boolean;
            color: string;
            image: Id | null;
            order: number;
            permissions: {
                channelControl: boolean;
                roomControl: boolean;
                createInvitation: boolean;
                kickMember: boolean;
                banMember: boolean;
                isAdministrator: boolean;
            };
            createdAt: Timestamp;
        }
    }

    export module File {
        export interface Default {
            id: Id;
            name: string;
            size: number;
            type: string;
            base64: string;
            isDeletable: boolean;
            createdAt: Timestamp;
        }

        export type Encoded = Pick<
            File.Default,
            'name' | 'size' | 'type' | 'base64'
        >;

        export type Attachment = Pick<
            File.Default,
            'id' | 'name' | 'type' | 'size'
        >;
    }

    export module PrivateChannel {
        export interface Default {
            id: Id;
            members: [Id, Id];
            chat: Id;
            conversation: Id;
            createdAt: Timestamp;
        }
    }

    export module Chat {
        export type Default = {
            id: Id;
            ownerId: Id;
            owner: typeof MODEL_NAMES.PRIVATE_CHANNEL | typeof MODEL_NAMES.ROOM;
            messages: Id[];
        }
    }

    export module Conversation {
        export type Default = {
            id: Id;
            ownerId: Id;
            owner: typeof MODEL_NAMES.PRIVATE_CHANNEL | typeof MODEL_NAMES.ROOM;
            members: Map<UserId, PeerId>;
            startTimestamp: Timestamp;
        }
    }
}