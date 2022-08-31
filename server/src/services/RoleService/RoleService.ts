import { RoleDto } from '@dtos';
import { ChannelModel, RoleModel, UserModel } from '@models';
import { AuthorizedServiceType, IAddUserRoleRequest, ICreateRoleRequest, IDeleteRoleRequest, IDeleteUserRoleRequest, IGetManyRolesRequest, IGetOneRoleRequest, IRole, IUpdateRoleRequest } from '@types';
import { ApiError, array, objectId, transactionContainer } from '@utils';
import { AttachmentServiceHelpers } from '../AttachmentService';
import { ChannelServiceHelpers } from '../ChannelService';
import { RoleServiceHelpers } from './RoleServiceHelpers';



interface IRoleService {
    create: AuthorizedServiceType<ICreateRoleRequest, IRole>;
    getOne: AuthorizedServiceType<IGetOneRoleRequest, IRole>;
    // getMany: AuthorizedServiceType<IGetManyRolesRequest, IRole[]>;
    update: AuthorizedServiceType<IUpdateRoleRequest, IRole>;
    delete: AuthorizedServiceType<IDeleteRoleRequest, IRole>;
    addUser: AuthorizedServiceType<IAddUserRoleRequest, IRole>;
    deleteUser: AuthorizedServiceType<IDeleteUserRoleRequest, IRole>;
}

const { toObjectId } = objectId;
const { moveElement } = array;

export const RoleService: IRoleService = {
    async create({ userId, channelId, name }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const roles = await RoleModel.find({ channel: channelId });
                const role = new RoleModel({
                    name,
                    channel: channelId,
                    order: 0,
                });
                roles.splice(0, 0, role);

                await RoleServiceHelpers.saveReorderedRoles(roles);
                await ChannelServiceHelpers.addRole({ channelId, roleId: role._id });

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

    // async getMany({ userId }) {
    //     const roles = await RoleModel.find({ _id: { $in: roleIds } }, {}, { lean: true });
    //     if (!roles.length) {
    //         throw ApiError.badRequest('Роли не найдены');
    //     }

    //     const roleDtos = roles.map((role) => {
    //         return RoleDto.objectFromModel(role);
    //     });

    //     return roleDtos;
    // },

    async update({ userId, roleId, channelId, color, image, name, order, permissions }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const roleToUpdate = await RoleModel.findById(roleId, {}, { lean: true });
                const isEmptyImage = image && !image.filename || !image.base64url;
                const isntEmptyImage = image && image.filename && image.base64url;

                if (color) roleToUpdate.color = color;
                if (name) roleToUpdate.name = name;
                if (permissions) roleToUpdate.permissions = Object.assign(roleToUpdate.permissions, permissions);
                
                if (image) await AttachmentServiceHelpers.delete({ attachmentId: roleToUpdate.image });
                if (isEmptyImage) roleToUpdate.image = '';
                if (isntEmptyImage) {
                    const newImage = await AttachmentServiceHelpers.create({ 
                        base64url: image.base64url, 
                        filename: image.filename,
                    });
                    roleToUpdate.image = newImage.id;
                }

                if (order) {
                    const roles = await RoleModel.find({ channel: channelId }, 'order');
                    const sortedRoles = roles.sort((a, b) => a.order - b.order);
                    const reorderedRoles = moveElement(sortedRoles, roleToUpdate.order, order);

                    await RoleServiceHelpers.saveReorderedRoles(reorderedRoles);
                    
                    roleToUpdate.order = order;
                }


                await roleToUpdate.save(queryOptions());

                const updatedRoleDto = RoleDto.objectFromModel(roleToUpdate);

                onCommit(() => {
                    // RoleSubscription.update({ userId, role: updatedRoleDto });
                });

                return updatedRoleDto;
            },
        );
    },

    async delete({ userId, roleId, channelId }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const roles = await RoleModel.find({ channel: channelId });
                const deletedRole = await RoleModel.findByIdAndDelete(roleId, queryOptions());
                roles.splice(deletedRole.order, 1);

                await RoleServiceHelpers.saveReorderedRoles(roles);
                await ChannelServiceHelpers.removeRole({ roleId: deletedRole._id });
 
                const deletedRoleDto = RoleDto.objectFromModel(deletedRole);
                return deletedRoleDto;
            },
        );
    },

    async addUser({ userId, roleId, targetId }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const updatedRole = await RoleModel.findByIdAndUpdate(
                    roleId, 
                    { $push: { users: toObjectId(targetId) } },
                    queryOptions(),
                ).catch(() => {
                    throw ApiError.badRequest('Не удалось добавить пользователя к роли');
                });

                const updatedRoleDto = RoleDto.objectFromModel(updatedRole);
                return updatedRoleDto;
            },
        );
    },

    async deleteUser({ userId, roleId, targetId }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const updatedRole = await RoleModel.findByIdAndUpdate(
                    roleId, 
                    { $pull: { users: targetId } },
                    queryOptions(),
                ).catch(() => {
                    throw ApiError.badRequest('Не удалось удалить пользователя из роли');
                });

                const updatedRoleDto = RoleDto.objectFromModel(updatedRole);
                return updatedRoleDto;
            },
        );
    },
};