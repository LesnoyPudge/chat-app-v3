import { ChannelService } from '@services';
import { AuthorizedControllerType, ControllerType, IChannel, ICreateChannelRequest, IDeleteChannelRequest, IGetMenyChannelsRequest, IGetOneChannelRequest, IUpdateChannelRequest } from '@types';



interface IChannelController {
    create: AuthorizedControllerType<ICreateChannelRequest, never, IChannel>;
    getOne: ControllerType<IGetOneChannelRequest, never, IChannel>;
    getMeny: ControllerType<IGetMenyChannelsRequest, never, IChannel[]>;
    update: AuthorizedControllerType<IUpdateChannelRequest, never, IChannel>;
    delete: AuthorizedControllerType<IDeleteChannelRequest, never, IChannel>;
}

export const ChannelController: IChannelController = {
    async create(req, res) {
        const { name, identifier } = req.body;
        const { user } = req.auth;
        
        const channel = await ChannelService.create({ name, identifier, userId: user.id });

        res.json(channel);
    },
    
    async getOne(req, res) {
        const { channelId } = req.body;

        const channel = await ChannelService.getOne({ channelId });

        res.json(channel);
    },

    async getMeny(req, res) {
        const { channelIds } = req.body;
        
        const channels = await ChannelService.getMeny({ channelIds });

        res.json(channels);
    },

    async update(req, res) {
        const { channelId, newValues } = req.body;
        const { user } = req.auth;
        
        const updatedChannel = await ChannelService.update({ userId: user.id, channelId, newValues });

        res.json(updatedChannel);
    },

    async delete(req, res) {
        const { channelId } = req.body;
        const { user } = req.auth;
        
        const updatedChannel = await ChannelService.delete({ userId: user.id, channelId });

        res.json(updatedChannel);
    },
};