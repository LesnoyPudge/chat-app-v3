import { ChannelService } from '@services';
import { AuthorizedControllerType, ControllerType, IChannel, ICreateChannelRequest, IDeleteChannelRequest, IGetManyChannelsRequest, IGetOneChannelRequest, IUpdateChannelRequest } from '@types';



interface IChannelController {
    create: AuthorizedControllerType<ICreateChannelRequest, never, IChannel>;
    getOne: AuthorizedControllerType<IGetOneChannelRequest, never, IChannel>;
    getMany: AuthorizedControllerType<IGetManyChannelsRequest, never, IChannel[]>;
    update: AuthorizedControllerType<IUpdateChannelRequest, never, IChannel>;
    delete: AuthorizedControllerType<IDeleteChannelRequest, never, IChannel>;
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
};