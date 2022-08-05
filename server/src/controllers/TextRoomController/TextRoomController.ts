import { TextRoomService } from '@services';
import { AuthorizedControllerType, ICreateTextRoomRequest, IDeleteTextRoomRequest, IGetManyTextRoomsRequest, IGetOneTextRoomRequest, ITextRoom, IUpdateTextRoomRequest } from '@types';



interface ITextRoomController {
    create: AuthorizedControllerType<ICreateTextRoomRequest, never, ITextRoom>;
    getOne: AuthorizedControllerType<IGetOneTextRoomRequest, never, ITextRoom>;
    getMany: AuthorizedControllerType<IGetManyTextRoomsRequest, never, ITextRoom[]>;
    update: AuthorizedControllerType<IUpdateTextRoomRequest, never, ITextRoom>;
    delete: AuthorizedControllerType<IDeleteTextRoomRequest, never, ITextRoom>;
}

export const TextRoomController: ITextRoomController = {
    async create(req, res) {
        const { name, identifier, channelId } = req.body;
        const { id } = req.auth.user;
        
        const textRoom = await TextRoomService.create({ userId: id, channelId, name, identifier });

        res.json(textRoom);
    },
    
    async getOne(req, res) {
        const { textRoomId } = req.body;
        const { id } = req.auth.user;

        const TextRoom = await TextRoomService.getOne({ userId: id, textRoomId });

        res.json(TextRoom);
    },

    async getMany(req, res) {
        const { textRoomIds } = req.body;
        const { id } = req.auth.user;

        const TextRooms = await TextRoomService.getMany({ userId: id, textRoomIds });

        res.json(TextRooms);
    },

    async update(req, res) {
        const { textRoomId, newValues } = req.body;
        const { id } = req.auth.user;
        
        const updatedTextRoom = await TextRoomService.update({ userId: id, textRoomId, newValues });

        res.json(updatedTextRoom);
    },

    async delete(req, res) {
        const { textRoomId } = req.body;
        const { id } = req.auth.user;
        
        const deletedTextRoom = await TextRoomService.delete({ userId: id, textRoomId });

        res.json(deletedTextRoom);
    },
};