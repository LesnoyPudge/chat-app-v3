import { RoleDto } from '@dtos';
import { RoleModel } from '@models';
import { objectId, transactionContainer } from '@utils';
import { Types } from 'mongoose';



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
                        kickMembers: true,
                        banMembers: true,
                        sendMessages: true,
                        deleteMessages: true,
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
};