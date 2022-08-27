import { TextRoomDto } from '@dtos';
import { TextRoomModel } from '@models';
import { subscription } from '@subscription';
import { AuthorizedServiceType, ICreateTextRoomRequest, IDeleteTextRoomRequest, IGetManyTextRoomsRequest, IGetOneTextRoomRequest, ITextRoom, IUpdateTextRoomRequest } from '@types';
import { ApiError, transactionContainer } from '@utils';
import { ChannelServiceHelpers } from '@services';



interface ITextRoomService {
    create: AuthorizedServiceType<ICreateTextRoomRequest, ITextRoom>;
    getOne: AuthorizedServiceType<IGetOneTextRoomRequest, ITextRoom>;
    // getMany: AuthorizedServiceType<IGetManyTextRoomsRequest, ITextRoom[]>;
    update: AuthorizedServiceType<IUpdateTextRoomRequest, ITextRoom>;
    delete: AuthorizedServiceType<IDeleteTextRoomRequest, ITextRoom>;
}

export const TextRoomService: ITextRoomService = {
    async create({ userId, channelId, name, identifier }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const textRoom = new TextRoomModel({
                    name,
                    identifier,
                    channel: channelId,
                });
                
                await textRoom.save(queryOptions());

                await ChannelServiceHelpers.addTextRoom({ channelId, textRoomId: textRoom._id });
                
                const textRoomDto = TextRoomDto.objectFromModel(textRoom);
                return textRoomDto;
            },
        );
    },

    async getOne({ userId, textRoomId }) {
        const textRoom = await TextRoomModel.findById(textRoomId, {}, { lean: true });
        if (!textRoom) throw ApiError.badRequest('Комната не найдена');

        const textRoomDto = TextRoomDto.objectFromModel(textRoom);
        return textRoomDto;
    },

    // async getMany({ userId, textRoomIds }) {
    //     const textRooms = await TextRoomModel.find({ _id: { $in: textRoomIds } }, {}, { lean: true });
    //     if (!textRooms.length) {
    //         throw ApiError.badRequest('Комнаты не найдены');
    //     }

    //     const textRoomDtos = textRooms.map((textRoom) => {
    //         return TextRoomDto.objectFromModel(textRoom);
    //     });

    //     return textRoomDtos;
    // },

    async update({ userId, textRoomId, newValues }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedTextRoom = await TextRoomModel.findByIdAndUpdate(
                    textRoomId,
                    newValues,
                    queryOptions({ new: true }),
                );
                if (!updatedTextRoom) throw ApiError.badRequest('Не удалось обновить комнату');

                const updatedTextRoomDto = TextRoomDto.objectFromModel(updatedTextRoom);

                onCommit(() => {
                    subscription.textRooms.update({ entity: updatedTextRoomDto });
                });

                return updatedTextRoomDto;
            },
        );
    },

    async delete({ userId, textRoomId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const deletedTextRoom = await TextRoomModel.findByIdAndDelete(
                    textRoomId,
                    queryOptions({ new: true }),
                );
                if (!deletedTextRoom) throw ApiError.badRequest('Не удалось удалить комнату');
            
                await ChannelServiceHelpers.removeTextRoom({ textRoomId });

                const deletedTextRoomDto = TextRoomDto.objectFromModel(deletedTextRoom);
                
                onCommit(() => {
                    subscription.textRooms.delete({ entityId: textRoomId });
                });
                
                return deletedTextRoomDto;
            },
        );
    },
};