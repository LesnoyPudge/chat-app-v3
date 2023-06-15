import { PrivateChannelService } from '@services';
import { Endpoints } from '@shared';
import { AuthorizedMiddleware } from '@types';



interface PrivateChannelController {
    [Endpoints.V1.PrivateChannel.Create.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.PrivateChannel.Create.RequestBody,
        Endpoints.V1.PrivateChannel.Create.Response
    >;
    [Endpoints.V1.PrivateChannel.GetOne.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.PrivateChannel.GetOne.RequestBody,
        Endpoints.V1.PrivateChannel.GetOne.Response
    >;
}

export const PrivateChannelController: PrivateChannelController = {
    async create(req, res) {
        const privateChannel = await PrivateChannelService.create(req.auth, req.body);
        res.json(privateChannel);
    },
    
    async getOne(req, res) {
        const privateChannel = await PrivateChannelService.getOne(req.auth, req.body);
        res.json(privateChannel);
    },
};