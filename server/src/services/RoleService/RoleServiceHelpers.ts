import { RoleDto } from '@dtos';
import { IRoleModel, RoleModel } from '@models';
import { subscription } from '@subscription';
import { objectId, transactionContainer } from '@utils';
import { FilterQuery, Types } from 'mongoose';



const { toObjectId } = objectId;

export const RoleServiceHelpers = {
    async createDefaultRole({ userId, channelId }: {userId: string, channelId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions }) => {
                const defaulRole = await RoleModel.create([{
                    channel: toObjectId(channelId),
                    users: [userId],
                    isDefault: true,
                }, queryOptions()]).then((roles) => roles[0]);
                
                return defaulRole;
            },
        );
    },

    async createAdminRole({ userId, channelId }: {userId: string, channelId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions }) => {
                const adminRole = await RoleModel.create([{
                    channel: toObjectId(channelId),
                    users: [userId],
                    isDefault: true,
                    permissions: {
                        channelControl: true,
                        roomControl: true,
                        createInvitation: true,
                        kickMember: true,
                        banMember: true,
                        sendMessage: true,
                        deleteMessage: true,
                        isAdministrator: true,
                    },
                }, queryOptions()]).then((roles) => roles[0]);
                
                return adminRole;
            },
        );
    },

    async deleteManyByChannelId({ channelId }: {channelId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const rolesToDelete = await RoleModel.find({ channel: channelId }, '_id');

                await Promise.all(rolesToDelete.map(async(role) => {
                    await role.delete(queryOptions());

                    onCommit(() => {
                        subscription.roles.delete({ entityId: role._id.toString() });
                    });
                }));
            },
        );
    },

    async isRoleExist(filter: FilterQuery<IRoleModel>) {
        return !!await RoleModel.exists(filter);
    },

    async saveReorderedRoles(reorderedRoles: (IRoleModel & {_id: Types.ObjectId})[]) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                await Promise.all(
                    reorderedRoles.map(async(role, index) => {
                        if (role.order === index) return;

                        role.order = index;
                        
                        await role.save(queryOptions());

                        onCommit(() => {
                            subscription.roles.update({ entity: RoleDto.objectFromModel(role) });
                        });
                    }),
                );
            },
        );
    },

    async getOne(filter: FilterQuery<IRoleModel>) {
        const role = await RoleModel.findOne(filter, {}, { lean: true });
        return role;
    },

    async getMany(filter: FilterQuery<IRoleModel>) {
        const roles = await RoleModel.find(filter, {}, { lean: true });
        return roles;
    },
};