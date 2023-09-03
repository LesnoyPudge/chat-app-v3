import { HelperService } from '@services';
import { Endpoints } from '@shared';
import { AuthorizedMiddleware } from '@types';



interface HelperController {
    [Endpoints.V1.Helper.GetAvailableTextRoomIds.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Helper.GetAvailableTextRoomIds.RequestBody,
        Endpoints.V1.Helper.GetAvailableTextRoomIds.Response
    >;
}

export const HelperController: HelperController = {
    async getAvailableTextRoomIds(req, res) {
        const rooms = await HelperService.getAvailableTextRoomIds(req.auth, req.body);
        res.json(rooms);
    },
};