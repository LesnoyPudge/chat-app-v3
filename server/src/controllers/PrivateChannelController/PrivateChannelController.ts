import { PrivateChannelService } from '@services';
import { AuthorizedControllerType, ICreatePrivateChannelRequest, ILeavePrivateChannelRequest, IGetOnePrivateChannelRequest, IPrivateChannel } from '@types';



interface IPrivateChannelController {
    create: AuthorizedControllerType<ICreatePrivateChannelRequest, never, IPrivateChannel>;
    getOne: AuthorizedControllerType<IGetOnePrivateChannelRequest, never, IPrivateChannel>;
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

        const privateChannel = await PrivateChannelService.getOne({ userId: id, privateChannelId });

        res.json(privateChannel);
    },

    async leave(req, res) {
        const { privateChannelId } = req.body;
        const { id } = req.auth.user;
        
        const updatedPrivateChannel = await PrivateChannelService.leave({ userId: id, privateChannelId });

        res.json(updatedPrivateChannel);
    },
};