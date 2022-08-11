import { IRoleModel } from '@models';
import { IRole } from '@types';



interface IRoleDto {
    objectFromModel: (role: IRoleModel) => IRole;
}

export const RoleDto: IRoleDto = {
    objectFromModel(role) {
        return {
            id: role._id.toString(),
            name: role.name,
            channel: role.channel.toString(),
            users: role.users.map((userId) => {
                return userId.toString();
            }),
            color: role.color,
            image: role.image,
            order: role.order,
            isDefault: role.isDefault,
            permissions: role.permissions,
            createdAt: role.createdAt.toString(),
            updatedAt: role.updatedAt.toString(),
        };
    },
};