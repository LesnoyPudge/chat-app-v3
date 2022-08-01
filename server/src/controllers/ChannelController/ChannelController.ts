import { ChannelService } from '@services';
import { AuthorizedControllerType, ControllerType, IChannel } from '@types';



interface IChannelController {
    create: AuthorizedControllerType<{name: string, identifier: string}, never, IChannel>;
    getOne: ControllerType<{channelId: string}, never, IChannel>;
    getMeny: ControllerType<{channelIds: string[]}, never, IChannel[]>;
    update: AuthorizedControllerType<{channelId: string, newValues: IChannel}, never, IChannel>;
    delete: AuthorizedControllerType<{channelId: string}, never, IChannel>;
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