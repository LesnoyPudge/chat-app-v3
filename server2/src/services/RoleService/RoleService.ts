import { RoleModel, transactionContainer } from '@database';
import { ApiError } from '@errors';
import { ChannelServiceHelpers, FileServiceHelpers } from '@services';
import { Endpoints } from '@shared';
import { RoleSubscription } from '@subscription';
import { AuthorizedService } from '@types';



interface RoleService {
    [Endpoints.V1.Role.Create.ActionName]: AuthorizedService<
        Endpoints.V1.Role.Create.RequestBody,
        Endpoints.V1.Role.Create.Response
    >;
    [Endpoints.V1.Role.GetOne.ActionName]: AuthorizedService<
        Endpoints.V1.Role.GetOne.RequestBody,
        Endpoints.V1.Role.GetOne.Response
    >;
    [Endpoints.V1.Role.Update.ActionName]: AuthorizedService<
        Endpoints.V1.Role.Update.RequestBody,
        Endpoints.V1.Role.Update.Response
    >;
    [Endpoints.V1.Role.Delete.ActionName]: AuthorizedService<
        Endpoints.V1.Role.Delete.RequestBody,
        Endpoints.V1.Role.Delete.Response
    >;
    [Endpoints.V1.Role.AddMember.ActionName]: AuthorizedService<
        Endpoints.V1.Role.AddMember.RequestBody,
        Endpoints.V1.Role.AddMember.Response
    >;
    [Endpoints.V1.Role.RemoveMember.ActionName]: AuthorizedService<
        Endpoints.V1.Role.RemoveMember.RequestBody,
        Endpoints.V1.Role.RemoveMember.Response
    >;
}

export const RoleService: RoleService = {
    async create(_, { channelId, name }) {
        return transactionContainer(
            async({ session }) => {
                const roles = await RoleModel.find({ channel: channelId }).lean();

                const role = await RoleModel.create([{
                    name,
                    channel: channelId,
                    order: roles.length,
                }], { session }).then((v) => v[0]);

                await ChannelServiceHelpers.addRole({ channelId, roleId: role.id });
                
                return role;
            },
        );
    },

    async getOne(_, { roleId }) {
        const role = await RoleModel.findOne({ id: roleId }).lean();

        if (!role) throw ApiError.internal();

        return role;
    },

    async update(_, { roleId, channelId, image, ...newValues }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const partiallyUpdatedRole = await RoleModel.findOneAndUpdate(
                    { id: roleId }, newValues, { new: true },
                ).session(session);

                if (!partiallyUpdatedRole) throw ApiError.internal();

                const isImageProvided = image !== undefined;
                
                if (isImageProvided) {
                    await FileServiceHelpers.delete(partiallyUpdatedRole.image);
                }

                if (isImageProvided && image === null) {
                    partiallyUpdatedRole.image = null;
                }

                if (isImageProvided && image !== null) {
                    const newImage = await FileServiceHelpers.create(image);
                    partiallyUpdatedRole.image = newImage.id;
                }

                const updatedRole = await partiallyUpdatedRole.save({ session });

                onCommit(() => {
                    RoleSubscription.update(updatedRole);
                });

                return updatedRole;
            },
        );
    },

    async delete(_, { roleId }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const deletedRole = await RoleModel.findOneAndDelete(
                    { id: roleId },
                ).session(session).lean();

                if (!deletedRole) throw ApiError.internal();

                await ChannelServiceHelpers.removeRole({ roleId: deletedRole.id });
 
                onCommit(() => {
                    RoleSubscription.delete(roleId);
                });
            },
        );
    },

    async addMember(_, { roleId, targetId }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedRole = await RoleModel.findOneAndUpdate(
                    { id: roleId }, 
                    { $push: { users: targetId } },
                    { new: true },
                ).session(session).lean();

                if (!updatedRole) throw ApiError.internal();

                onCommit(() => {
                    RoleSubscription.update(updatedRole);
                });

                return updatedRole;
            },
        );
    },

    async removeMember(_, { roleId, targetId }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedRole = await RoleModel.findOneAndUpdate(
                    { id: roleId }, 
                    { $pull: { users: targetId } },
                    { new: true },
                ).session(session).lean();

                if (!updatedRole) throw ApiError.internal();

                onCommit(() => {
                    RoleSubscription.update(updatedRole);
                });

                return updatedRole;
            },
        );
    },
};