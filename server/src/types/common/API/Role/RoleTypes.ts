


export interface IRole {
    id: string;
    name: string;
    channel: string;
    users: string[];
    isDefault: boolean;
    color: string;
    image: string;
    order: number;
    permissions: {
        channelControl: boolean;
        roomControl: boolean;
        createInvitation: boolean;
        kickMember: boolean;
        banMember: boolean;
        sendMessage: boolean;
        deleteMessage: boolean;
        isAdministrator: boolean;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ICreateRoleRequest {
    channelId: string;
    name: string;
}

export interface IDeleteRoleRequest {
    channelId: string;
    roleId: string;
}

export interface IGetOneRoleRequest {
    channelId: string;
    roleId: string;    
}

export interface IGetManyRolesRequest {
    channelId: string;
    roleIds: string;
}

export interface IUpdateRoleRequest {
    channelId: string;
    roleId: string;
    newValues: Partial<IRole>;
}

export interface IAddUserRoleRequest {
    channelId: string;
    roleId: string;
    targetId: string;
}

export interface IDeleteUserRoleRequest {
    channelId: string;
    roleId: string;
    targetId: string;
}