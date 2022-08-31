import { RoleDto } from '@dtos';
import { IRoleModel, RoleModel } from '@models';
import { array, objectId, transactionContainer } from '@utils';
import { FilterQuery, Types } from 'mongoose';



const { toObjectId } = objectId;
const { moveElement } = array;

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
            async({ queryOptions }) => {
                await RoleModel.deleteMany({ channel: channelId }, queryOptions());
            },
        );
    },

    async isRoleExist(filter: FilterQuery<IRoleModel>) {
        return !!await RoleModel.exists(filter);
    },

    async saveReorderedRoles(reorderedRoles: (IRoleModel & {_id: Types.ObjectId})[]) {
        return transactionContainer(
            async({ queryOptions }) => {
                await Promise.all(
                    reorderedRoles.map(async(role, index) => {
                        if (role.order === index) return;

                        role.order = index;
                        
                        await role.save(queryOptions());
                    }),
                );
            },
        );
    },
};