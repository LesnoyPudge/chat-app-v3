import { Id, Timestamp } from './index';



export interface User {
    id: Id;
    login: string;
    password: string;
    username: string;
    avatar: Id;
    email: string | null;
    extraStatus: 'default' | 'afk' | 'dnd' | 'invisible';
    isActivated: boolean;
    settings: {
        theme: 'auto' | 'dark' | 'light';
        fontSize: 12 | 14 | 16 | 18 | 20;
        messageGroupSpacing: 16 | 20;
    };
    blockList: Id[];
    channels: Id[];
    privateChannels: Id[];
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

export interface Channel {
    id: Id;
    identifier: string;
    avatar: Id | null;
    name: string;
    owner: Id;
    isPrivate: boolean;
    members: Id[];
    rooms: Id[];
    roles: Id[];
    banList: {
        user: Id;
        reason: string | null;
    }[];
    invitations: {
        creator: Id;
        code: string;
        expiryDate: Timestamp | null;
        createdAt: Timestamp;
    }[];
    createdAt: Timestamp;
}

export interface Room {
    id: Id;
    name: string;
    channel: Id;
    isPrivate: boolean;
    chat: {
        id: Id;
        messages: Id[];
    };
    whiteList: {
        users: Id[];
        roles: Id[];
    };
    type: 'voice' | 'text';
    createdAt: Timestamp;
}

export interface Role {
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
        sendMessage: boolean;
        isAdministrator: boolean;
    };
    createdAt: Timestamp;
}

export interface Message {
    id: Id;
    chat: Id;
    user: Id;
    content: string;
    attachments: Id[];
    isChanged: boolean;
    isDeleted: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface File {
    id: Id;
    filename: string;
    base64url: string;
    isDeletable: boolean;
    createdAt: Timestamp;
}

export interface PrivateChannel {
    id: Id;
    members: [Id, Id];
    activeMembers: Id[];
    chat: {
        id: Id;
        messages: Id[]
    };
    createdAt: Timestamp;
}