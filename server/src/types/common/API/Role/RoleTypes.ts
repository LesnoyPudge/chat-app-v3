


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
    roleId: string;
}

export interface IGetOneRoleRequest {
    roleId: string;    
}

export interface IGetManyRolesRequest {
    roleIds: string;
}

export interface IUpdateRoleRequest {
    roleId: string;
    newValues: Partial<IRole>;
}

export interface IAddUserRoleRequest {
    roleId: string;
    targetId: string;
}

export interface IDeleteUserRoleRequest {
    roleId: string;
    targetId: string;
}