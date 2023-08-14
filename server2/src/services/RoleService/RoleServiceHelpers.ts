import { RoleModel, transactionContainer } from '@database';
import { Entities, WithChannelId, WithUserId } from '@shared';
import { RoleSubscription } from '@subscription';
import { FilterQuery } from 'mongoose';



export const RoleServiceHelpers = {
    async createDefaultRole({ userId, channelId }: WithUserId & WithChannelId) {
        return transactionContainer(
            async({ session }) => {
                const defaultRole = await RoleModel.create([{
                    channel: channelId,
                    users: [userId],
                    isDefault: true,
                    name: 'default',
                    order: 1,
                }], { session }).then((v) => v[0]);

                return defaultRole;
            },
        );
    },

    async createAdminRole({ userId, channelId }: WithUserId & WithChannelId) {
        return transactionContainer(
            async({ session }) => {
                const adminRole = await RoleModel.create([{
                    channel: channelId,
                    users: [userId],
                    isDefault: true,
                    name: 'admin',
                    order: 0,
                    permissions: {
                        channelControl: true,
                        roomControl: true,
                        createInvitation: true,
                        kickMember: true,
                        banMember: true,
                        isAdministrator: true,
                    },
                }], { session }).then((v) => v[0]);

                return adminRole;
            },
        );
    },

    async deleteManyByChannelId({ channelId }: WithChannelId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const rolesToDelete = await RoleModel.find({ channel: channelId });

                await Promise.all(rolesToDelete.map(async(role) => {
                    await role.deleteOne({ session });

                    onCommit(() => {
                        RoleSubscription.delete(role.id);
                    });
                }));
            },
        );
    },

    async isExist(filter: FilterQuery<Entities.Role.Default>) {
        return !!await RoleModel.exists(filter).lean();
    },

    async getOne(filter: FilterQuery<Entities.Role.Default>) {
        return await RoleModel.findOne(filter).lean();
    },

    async getMany(filter: FilterQuery<Entities.Role.Default>) {
        return await RoleModel.find(filter).lean();
    },
};