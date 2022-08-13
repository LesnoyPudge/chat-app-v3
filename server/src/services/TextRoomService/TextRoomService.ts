import { TextRoomDto } from '@dtos';
import { ChannelModel, TextRoomModel } from '@models';
import { subscription } from '@subscription';
import { AuthorizedServiceType, ICreateTextRoomRequest, IDeleteTextRoomRequest, IGetManyTextRoomsRequest, IGetOneTextRoomRequest, ITextRoom, IUpdateTextRoomRequest } from '@types';
import { ApiError, transactionContainer } from '@utils';



interface ITextRoomService {
    create: AuthorizedServiceType<ICreateTextRoomRequest, ITextRoom>;
    getOne: AuthorizedServiceType<IGetOneTextRoomRequest, ITextRoom>;
    getMany: AuthorizedServiceType<IGetManyTextRoomsRequest, ITextRoom[]>;
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
                
                // create chat
                // add chat to textRoom

                await textRoom.save(queryOptions());

                await ChannelModel.updateOne(
                    { _id: channelId }, 
                    { $push: { textRooms: textRoom._id } },
                    queryOptions(),
                );
                
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

    async getMany({ userId, textRoomIds }) {
        const textRooms = await TextRoomModel.find({ _id: { $in: textRoomIds } }, {}, { lean: true });
        if (!textRooms.length) {
            throw ApiError.badRequest('Комнаты не найдены');
        }

        const textRoomDtos = textRooms.map((textRoom) => {
            return TextRoomDto.objectFromModel(textRoom);
        });

        return textRoomDtos;
    },

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
                    subscription.textRooms.update({ userId, entity: updatedTextRoomDto });
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
            
                await ChannelModel.updateOne(
                    { _id: deletedTextRoom._id }, 
                    { $pull: { textRooms: textRoomId } }, 
                    queryOptions(),
                );

                const deletedTextRoomDto = TextRoomDto.objectFromModel(deletedTextRoom);
                
                onCommit(() => {
                    // вынести update channel в channel service helpers 
                    // и там вызвать onCommit socket channelSubscription update
                    
                    // socket textRoomSubscribtion delete
                });
                
                return deletedTextRoomDto;
            },
        );
    },
};