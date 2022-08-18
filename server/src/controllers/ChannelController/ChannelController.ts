import { ChannelService } from '@services';
import { AuthorizedControllerType, IAcceptInvitationChannelRequest, IBanUserChannelRequest, IChannel, ICreateChannelRequest, ICreateInvitationChannelRequest, IDeleteChannelRequest, IDeleteInvitationChannelRequest, IGetManyChannelsRequest, IGetOneChannelRequest, IKickUserChannelRequest, ILeaveChannelRequest, IUnbanUserChannelRequest, IUpdateChannelRequest } from '@types';



interface IChannelController {
    create: AuthorizedControllerType<ICreateChannelRequest, never, IChannel>;
    getOne: AuthorizedControllerType<IGetOneChannelRequest, never, IChannel>;
    getMany: AuthorizedControllerType<IGetManyChannelsRequest, never, IChannel[]>;
    update: AuthorizedControllerType<IUpdateChannelRequest, never, IChannel>;
    delete: AuthorizedControllerType<IDeleteChannelRequest, never, IChannel>;
    leave: AuthorizedControllerType<ILeaveChannelRequest, never, IChannel>;
    kickUser: AuthorizedControllerType<IKickUserChannelRequest, never, IChannel>;
    banUser: AuthorizedControllerType<IBanUserChannelRequest, never, IChannel>;
    unbanUser: AuthorizedControllerType<IUnbanUserChannelRequest, never, IChannel>;
    createInvitation: AuthorizedControllerType<ICreateInvitationChannelRequest, never, IChannel>;
    acceptInvitation: AuthorizedControllerType<IAcceptInvitationChannelRequest, never, IChannel>;
    deleteInvitation: AuthorizedControllerType<IDeleteInvitationChannelRequest, never, IChannel>;
}

export const ChannelController: IChannelController = {
    async create(req, res) {
        const { name, identifier } = req.body;
        const { id } = req.auth.user;
        
        const channel = await ChannelService.create({ name, identifier, userId: id });

        res.json(channel);
    },
    
    async getOne(req, res) {
        const { channelId } = req.body;
        const { id } = req.auth.user;

        const channel = await ChannelService.getOne({ userId: id, channelId });

        res.json(channel);
    },

    async getMany(req, res) {
        const { channelIds } = req.body;
        const { id } = req.auth.user;

        const channels = await ChannelService.getMany({ userId: id, channelIds });

        res.json(channels);
    },

    async update(req, res) {
        const { channelId, newValues } = req.body;
        const { id } = req.auth.user;
        
        const updatedChannel = await ChannelService.update({ userId: id, channelId, newValues });

        res.json(updatedChannel);
    },

    async delete(req, res) {
        const { channelId } = req.body;
        const { id } = req.auth.user;
        
        const deletedChannel = await ChannelService.delete({ userId: id, channelId });

        res.json(deletedChannel);
    },

    async leave(req, res) {
        const { channelId } = req.body;
        const { id } = req.auth.user;
        
        const updatedChannel = await ChannelService.leave({ userId: id, channelId });

        res.json(updatedChannel);
    },

    async kickUser(req, res) {
        const { channelId, targetId } = req.body;
        const { id } = req.auth.user;
        
        const updatedChannel = await ChannelService.kickUser({ userId: id, channelId, targetId });

        res.json(updatedChannel);
    },

    async banUser(req, res) {
        const { channelId, targetId, reason } = req.body;
        const { id } = req.auth.user;
        
        const updatedChannel = await ChannelService.banUser({ userId: id, channelId, targetId, reason });

        res.json(updatedChannel);
    },

    async unbanUser(req, res) {
        const { channelId, targetId } = req.body;
        const { id } = req.auth.user;
        
        const updatedChannel = await ChannelService.unbanUser({ userId: id, channelId, targetId });

        res.json(updatedChannel);
    },

    async createInvitation(req, res) {
        const { channelId, duration, code } = req.body;
        const { id } = req.auth.user;
        
        const updatedChannel = await ChannelService.createInvitation({ userId: id, channelId, duration, code });

        res.json(updatedChannel);
    },

    async acceptInvitation(req, res) {
        const { channelId, code } = req.body;
        const { id } = req.auth.user;
        
        const updatedChannel = await ChannelService.acceptInvitation({ userId: id, channelId, code });

        res.json(updatedChannel);
    },

    async deleteInvitation(req, res) {
        const { channelId, code } = req.body;
        const { id } = req.auth.user;
        
        const updatedChannel = await ChannelService.deleteInvitation({ userId: id, channelId, code });

        res.json(updatedChannel);
    },
};