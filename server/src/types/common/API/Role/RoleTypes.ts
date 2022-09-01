


interface IRolePermissions {
    channelControl: boolean;
    roomControl: boolean;
    createInvitation: boolean;
    kickMember: boolean;
    banMember: boolean;
    sendMessage: boolean;
    isAdministrator: boolean;
}

export interface IRole {
    id: string;
    name: string;
    channel: string;
    users: string[];
    isDefault: boolean;
    color: string;
    image: string;
    order: number;
    permissions: IRolePermissions;
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
    name?: string;
    color?: string;
    image?: {
        filename: string;
        base64url: string;
    };
    order?: number;
    permissions?: Partial<IRolePermissions>;
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