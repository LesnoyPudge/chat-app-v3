


export interface IChannel {
    id: string;
    identifier: string;
    avatar: string;
    name: string;
    owner: string;
    isPrivate: boolean;
    invitations: string[];
    members: string[];
    rooms: string[];
    roles: {
        users: string[];
        role: string;
    }[];
    banList: {
        user: string;
        reason: string;
    }[];
}