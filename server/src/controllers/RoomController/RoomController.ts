import { RoomService } from '@services';
import { AuthorizedControllerType, ICreateRoomRequest, IDeleteRoomRequest, IGetOneRoomRequest, IRoom, IUpdateRoomRequest } from '@types';



interface IRoomController {
    create: AuthorizedControllerType<ICreateRoomRequest, never, IRoom>;
    getOne: AuthorizedControllerType<IGetOneRoomRequest, never, IRoom>;
    update: AuthorizedControllerType<IUpdateRoomRequest, never, IRoom>;
    delete: AuthorizedControllerType<IDeleteRoomRequest, never, IRoom>;
}

export const RoomController: IRoomController = {
    async create(req, res) {
        const { name, channelId } = req.body;
        const { id } = req.auth.user;
        
        const room = await RoomService.create({ userId: id, channelId, name });

        res.json(room);
    },
    
    async getOne(req, res) {
        const { roomId, channelId } = req.body;
        const { id } = req.auth.user;

        const Room = await RoomService.getOne({ userId: id, roomId, channelId });

        res.json(Room);
    },

    // async getMany(req, res) {
    //     const { roomIds } = req.body;
    //     const { id } = req.auth.user;

    //     const rooms = await RoomService.getMany({ userId: id, roomIds });

    //     res.json(rooms);
    // },

    async update(req, res) {
        const { roomId, category, name, channelId } = req.body;
        const { id } = req.auth.user;
        
        const updatedRoom = await RoomService.update({ userId: id, roomId, category, name, channelId });

        res.json(updatedRoom);
    },

    async delete(req, res) {
        const { roomId, channelId } = req.body;
        const { id } = req.auth.user;
        
        const deletedRoom = await RoomService.delete({ userId: id, roomId, channelId });

        res.json(deletedRoom);
    },
};