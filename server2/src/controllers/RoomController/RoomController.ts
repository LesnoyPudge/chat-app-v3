import { RoomService } from '@services';
import { Endpoints } from '@shared';
import { AuthorizedMiddleware } from '@types';



interface RoomController {
    [Endpoints.V1.Room.Create.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Room.Create.RequestBody,
        Endpoints.V1.Room.Create.Response
    >;
    [Endpoints.V1.Room.GetOne.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Room.GetOne.RequestBody,
        Endpoints.V1.Room.GetOne.Response
    >;
    [Endpoints.V1.Room.Update.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Room.Update.RequestBody,
        Endpoints.V1.Room.Update.Response
    >;
    [Endpoints.V1.Room.Delete.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Room.Delete.RequestBody,
        Endpoints.V1.Room.Delete.Response
    >;
}

export const RoomController: RoomController = {
    async create(req, res) {
        const room = await RoomService.create(req.auth, req.body);
        res.json(room);
    },
    
    async getOne(req, res) {
        const room = await RoomService.getOne(req.auth, req.body);
        res.json(room);
    },

    async update(req, res) {
        const room = await RoomService.update(req.auth, req.body);
        res.json(room);
    },

    async delete(req, res) {
        const room = await RoomService.delete(req.auth, req.body);
        res.json(room);
    },
};