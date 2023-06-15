import { ChannelModel, transactionContainer } from '@database';
import { AuthorizedService } from '@types';
import { getRandomString } from '@utils';
import { UserServiceHelpers, RoleServiceHelpers, RoomServiceHelpers, FileServiceHelpers } from '@services';
import { Endpoints } from '@shared';
import { ApiError } from '@errors';
import { ChannelSubscription } from '@subscription';



interface ChannelService {
    [Endpoints.V1.Channel.Create.ActionName]: AuthorizedService<
        Endpoints.V1.Channel.Create.RequestBody,
        Endpoints.V1.Channel.Create.Response
    >;
    [Endpoints.V1.Channel.GetOne.ActionName]: AuthorizedService<
        Endpoints.V1.Channel.GetOne.RequestBody,
        Endpoints.V1.Channel.GetOne.Response
    >;
    [Endpoints.V1.Channel.Update.ActionName]: AuthorizedService<
        Endpoints.V1.Channel.Update.RequestBody,
        Endpoints.V1.Channel.Update.Response
    >;
    [Endpoints.V1.Channel.Delete.ActionName]: AuthorizedService<
        Endpoints.V1.Channel.Delete.RequestBody,
        Endpoints.V1.Channel.Delete.Response
    >;
    [Endpoints.V1.Channel.Leave.ActionName]: AuthorizedService<
        Endpoints.V1.Channel.Leave.RequestBody,
        Endpoints.V1.Channel.Leave.Response
    >;
    [Endpoints.V1.Channel.Kick.ActionName]: AuthorizedService<
        Endpoints.V1.Channel.Kick.RequestBody,
        Endpoints.V1.Channel.Kick.Response
    >;
    [Endpoints.V1.Channel.Ban.ActionName]: AuthorizedService<
        Endpoints.V1.Channel.Ban.RequestBody,
        Endpoints.V1.Channel.Ban.Response
    >;
    [Endpoints.V1.Channel.Unban.ActionName]: AuthorizedService<
        Endpoints.V1.Channel.Unban.RequestBody,
        Endpoints.V1.Channel.Unban.Response
    >;
    [Endpoints.V1.Channel.CreateInvitation.ActionName]: AuthorizedService<
        Endpoints.V1.Channel.CreateInvitation.RequestBody,
        Endpoints.V1.Channel.CreateInvitation.Response
    >;
    [Endpoints.V1.Channel.AcceptInvitation.ActionName]: AuthorizedService<
        Endpoints.V1.Channel.AcceptInvitation.RequestBody,
        Endpoints.V1.Channel.AcceptInvitation.Response
    >;
    [Endpoints.V1.Channel.DeleteInvitation.ActionName]: AuthorizedService<
        Endpoints.V1.Channel.DeleteInvitation.RequestBody,
        Endpoints.V1.Channel.DeleteInvitation.Response
    >;
}

export const ChannelService: ChannelService = {
    async create({ id }, { name, identifier, avatar }) {
        return transactionContainer(
            async({ session }) => {
                const channelAvatar = !avatar ? null : (await FileServiceHelpers.create(avatar)).id;

                const newChannel = new ChannelModel({
                    identifier,
                    name,
                    avatar: channelAvatar,
                    owner: id,
                    members: [id],
                });

                await UserServiceHelpers.addChannel({ userId: id, channelId: newChannel.id });
               
                const adminRole = await RoleServiceHelpers.createAdminRole({ userId: id, channelId: newChannel.id });
                const defaultRole = await RoleServiceHelpers.createDefaultRole({ userId: id, channelId: newChannel.id });
                
                newChannel.roles = [adminRole.id, defaultRole.id];

                const room = await RoomServiceHelpers.createDefaultRoom({ channelId: newChannel.id });

                newChannel.rooms = [room.id];

                const channel = await newChannel.save({ session });

                return channel.toObject();
            },
        );
    },

    async getOne(_, { channelId }) {
        const channel = await ChannelModel.findOne({ id: channelId }).lean();

        if (!channel) throw ApiError.internal();

        return channel;
    },

    async update(_, { channelId, avatar, name }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const partiallyUpdatedChannel = await ChannelModel.findOneAndUpdate(
                    { id: channelId }, { name }, { new: true },
                ).session(session);

                if (!partiallyUpdatedChannel) throw ApiError.internal();

                const isNewAvatarProvided = avatar !== undefined;

                if (isNewAvatarProvided) {
                    await FileServiceHelpers.delete(partiallyUpdatedChannel.avatar);
                }

                if (isNewAvatarProvided && avatar === null) {
                    partiallyUpdatedChannel.avatar = null;
                }

                if (isNewAvatarProvided && avatar !== null) {
                    const newAvatar = await FileServiceHelpers.create(avatar);
                    partiallyUpdatedChannel.avatar = newAvatar.id;
                }

                const updatedChannel = await partiallyUpdatedChannel.save({ session });

                onCommit(() => {
                    ChannelSubscription.update(updatedChannel);
                });

                return updatedChannel;
            },
        );
    },

    async delete(_, { channelId }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const deletedChannel = await ChannelModel.findOneAndDelete(
                    { id: channelId },
                ).session(session).lean();

                if (!deletedChannel) throw ApiError.internal();

                await UserServiceHelpers.removeChannelFromMany({ channelId });
                await RoleServiceHelpers.deleteManyByChannelId({ channelId });
                await RoomServiceHelpers.deleteManyByChannelId({ channelId });
                
                onCommit(() => {
                    ChannelSubscription.delete(channelId);
                });

                return deletedChannel;
            },
        );
    },

    async leave({ id }, { channelId }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedChannel = await ChannelModel.findOneAndUpdate(
                    { id: channelId }, 
                    { $pull: { members: id } },
                    { new: true },
                ).session(session).lean();

                if (!updatedChannel) throw ApiError.internal();

                await UserServiceHelpers.removeChannel({ userId: id, channelId });

                onCommit(() => {
                    ChannelSubscription.update(updatedChannel);
                });

                return updatedChannel;
            },
        );
    },

    async kick(_, { channelId, targetId }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedChannel = await ChannelModel.findOneAndUpdate(
                    { id: channelId }, 
                    { $pull: { members: targetId } },
                    { new: true },
                ).session(session).lean();

                if (!updatedChannel) throw ApiError.internal();

                await UserServiceHelpers.removeChannel({ userId: targetId, channelId });

                onCommit(() => {
                    ChannelSubscription.update(updatedChannel);
                });

                return updatedChannel;
            },
        );
    },

    async ban(_, { channelId, targetId, reason = null }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedChannel = await ChannelModel.findOneAndUpdate(
                    { id: channelId }, 
                    { 
                        $pull: { members: targetId },
                        $push: { banList: {
                            user: targetId,
                            reason,
                        } },
                    },
                    { new: true },
                ).session(session).lean();

                if (!updatedChannel) throw ApiError.internal();

                await UserServiceHelpers.removeChannel({ userId: targetId, channelId });

                onCommit(() => {
                    ChannelSubscription.update(updatedChannel);
                });

                return updatedChannel;
            },
        );
    },

    async unban(_, { channelId, targetId }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedChannel = await ChannelModel.findOneAndUpdate(
                    { id: channelId }, { $pull: { banned: targetId } }, { new: true },
                ).session(session).lean();

                if (!updatedChannel) throw ApiError.internal();

                onCommit(() => {
                    ChannelSubscription.update(updatedChannel);
                });

                return updatedChannel;
            },
        );
    },
    
    async createInvitation({ id }, { channelId, expiresAt }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedChannel = await ChannelModel.findOneAndUpdate(
                    { id: channelId },
                    { $push: { invitations: {
                        creator: id,
                        code: getRandomString(10),
                        expiresAt,
                        createdAt: Date.now(),
                    } } },
                    { new: true },
                ).session(session).lean();

                if (!updatedChannel) throw ApiError.internal();

                onCommit(() => {
                    ChannelSubscription.update(updatedChannel);
                });

                return updatedChannel;
            },
        );
    },

    async acceptInvitation({ id }, { channelId }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedChannel = await ChannelModel.findOneAndUpdate(
                    { id: channelId },
                    { $push: { members: id } },
                    { new: true },
                ).session(session).lean();

                if (!updatedChannel) throw ApiError.internal();

                onCommit(() => {
                    ChannelSubscription.update(updatedChannel);
                });

                return updatedChannel;
            },
        );
    },

    async deleteInvitation(_, { channelId, code }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedChannel = await ChannelModel.findOneAndUpdate(
                    { id: channelId }, { $pull: { invitations: { code } } }, { new: true },
                ).session(session).lean();

                if (!updatedChannel) throw ApiError.internal();

                onCommit(() => {
                    ChannelSubscription.update(updatedChannel);
                });

                return updatedChannel;
            },
        );
    },
};