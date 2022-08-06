import { PrivateChannelService } from '@services';
import { AuthorizedControllerType, ICreatePrivateChannelRequest, ILeavePrivateChannelRequest, IGetManyPrivateChannelsRequest, IGetOnePrivateChannelRequest, IPrivateChannel, IUpdatePrivateChannelRequest } from '@types';



interface IPrivateChannelController {
    create: AuthorizedControllerType<ICreatePrivateChannelRequest, never, IPrivateChannel>;
    getOne: AuthorizedControllerType<IGetOnePrivateChannelRequest, never, IPrivateChannel>;
    getMany: AuthorizedControllerType<IGetManyPrivateChannelsRequest, never, IPrivateChannel[]>;
    update: AuthorizedControllerType<IUpdatePrivateChannelRequest, never, IPrivateChannel>;
    leave: AuthorizedControllerType<ILeavePrivateChannelRequest, never, IPrivateChannel>;
}

export const PrivateChannelController: IPrivateChannelController = {
    async create(req, res) {
        const { targetId } = req.body;
        const { id } = req.auth.user;
        
        const privateChannel = await PrivateChannelService.create({ userId: id, targetId });

        res.json(privateChannel);
    },
    
    async getOne(req, res) {
        const { privateChannelId } = req.body;
        const { id } = req.auth.user;

        const PrivateChannel = await PrivateChannelService.getOne({ userId: id, privateChannelId });

        res.json(PrivateChannel);
    },

    async getMany(req, res) {
        const { privateChannelIds } = req.body;
        const { id } = req.auth.user;

        const PrivateChannels = await PrivateChannelService.getMany({ userId: id, privateChannelIds });

        res.json(PrivateChannels);
    },

    async update(req, res) {
        const { privateChannelId, newValues } = req.body;
        const { id } = req.auth.user;
        
        const updatedPrivateChannel = await PrivateChannelService.update({ userId: id, privateChannelId, newValues });

        res.json(updatedPrivateChannel);
    },

    async leave(req, res) {
        const { privateChannelId } = req.body;
        const { id } = req.auth.user;
        
        const updatedPrivateChannel = await PrivateChannelService.leave({ userId: id, privateChannelId });

        res.json(updatedPrivateChannel);
    },
};