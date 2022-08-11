import { RoleDto } from '@dtos';
import { ChannelModel, RoleModel, UserModel } from '@models';
import { AuthorizedServiceType, ICreateRoleRequest, IDeleteRoleRequest, IGetManyRolesRequest, IGetOneRoleRequest, IRole, IUpdateRoleRequest } from '@types';
import { ApiError, transactionContainer } from '@utils';



interface IRoleService {
    create: AuthorizedServiceType<ICreateRoleRequest, IRole>;
    getOne: AuthorizedServiceType<IGetOneRoleRequest, IRole>;
    getMany: AuthorizedServiceType<IGetManyRolesRequest, IRole[]>;
    update: AuthorizedServiceType<IUpdateRoleRequest, IRole>;
    delete: AuthorizedServiceType<IDeleteRoleRequest, IRole>;
}

export const RoleService: IRoleService = {
    async create({ userId, channelId, name }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const role = new RoleModel({
                    name,
                    channel: channelId,
                });

                await ChannelModel.updateOne(
                    { _id: channelId },
                    { $push: { roles: role._id } },
                    queryOptions(),
                );

                await role.save(queryOptions());
                
                const roleDto = RoleDto.objectFromModel(role);
                return roleDto;
            },
        );
    },

    async getOne({ userId, roleId }) {
        const role = await RoleModel.findById(roleId, {}, { lean: true });
        if (!role) throw ApiError.badRequest('Роль не найдена');

        const roleDto = RoleDto.objectFromModel(role);
        return roleDto;
    },

    async getMany({ userId, roleIds }) {
        const roles = await RoleModel.find({ _id: { $in: roleIds } }, {}, { lean: true });
        if (!roles.length) {
            throw ApiError.badRequest('Роли не найдены');
        }

        const roleDtos = roles.map((role) => {
            return RoleDto.objectFromModel(role);
        });

        return roleDtos;
    },

    async update({ userId, roleId, newValues }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedRole = await RoleModel.findByIdAndUpdate(
                    roleId,
                    newValues,
                    queryOptions({ new: true }),
                );
                if (!updatedRole) throw ApiError.badRequest('Не удалось обновить роль');

                const updatedRoleDto = RoleDto.objectFromModel(updatedRole);

                onCommit(() => {
                    // RoleSubscription.update({ userId, role: updatedRoleDto });
                });

                return updatedRoleDto;
            },
        );
    },

    async delete({ userId, roleId }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const deletedRole = await RoleModel.findByIdAndDelete(roleId, queryOptions());
                if (!deletedRole) {
                    throw ApiError.badRequest('Не удалось удалить роль');
                }

                await UserModel.updateMany(
                    { roles: roleId }, 
                    { $pull: { roles: roleId } }, 
                    queryOptions(),
                );
 
                const deletedRoleDto = RoleDto.objectFromModel(deletedRole);
                return deletedRoleDto;
            },
        );
    },
};