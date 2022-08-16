import { ChannelDto } from '@dtos';
import { ChannelModel } from '@models';
import { subscription } from '@subscription';
import { AuthorizedServiceType, IChannel, ICreateChannelRequest, IDeleteChannelRequest, IGetManyChannelsRequest, IGetOneChannelRequest, IUpdateChannelRequest } from '@types';
import { ApiError, transactionContainer } from '@utils';
import { UserServiceHelpers, RoleServiceHelpers, TextRoomServiceHelpers } from '@services';



interface IChannelService {
    create: AuthorizedServiceType<ICreateChannelRequest, IChannel>;
    getOne: AuthorizedServiceType<IGetOneChannelRequest, IChannel>;
    getMany: AuthorizedServiceType<IGetManyChannelsRequest, IChannel[]>;
    update: AuthorizedServiceType<IUpdateChannelRequest, IChannel>;
    delete: AuthorizedServiceType<IDeleteChannelRequest, IChannel>;
}

export const ChannelService: IChannelService = {
    async create({ name, identifier, userId }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const isChannelExist = await ChannelModel.exists({ identifier });
                if (isChannelExist) {
                    throw ApiError.badRequest('Канал с данным идентификатором уже существует');
                }

                const channel = new ChannelModel({
                    identifier,
                    name,
                    owner: userId,
                    members: [userId],
                });

                await UserServiceHelpers.addChannel({ userId, channelId: channel._id });
                
                const defaulRole = await RoleServiceHelpers.createDefaultRole({ userId, channelId: channel._id });
                const adminRole = await RoleServiceHelpers.createAdminRole({ userId, channelId: channel._id });
                channel.roles = [adminRole._id, defaulRole._id];

                const textRoom = await TextRoomServiceHelpers.createDefaultTextRoom({ channelId: channel._id });
                channel.textRooms = [textRoom._id];

                await channel.save(queryOptions());

                const channelDto = ChannelDto.objectFromModel(channel);
                return channelDto;
            },
        );
    },

    async getOne({ channelId }) {
        const channel = await ChannelModel.findById(channelId, {}, { lean: true });
        if (!channel) {
            throw ApiError.badRequest('Канал не найден');
        }

        const channelDto = ChannelDto.objectFromModel(channel);
        return channelDto;
    },

    async getMany({ channelIds }) {
        const channels = await ChannelModel.find({ _id: { $in: channelIds } }, {}, { lean: true });
        if (!channels.length) {
            throw ApiError.badRequest('Каналы не найдены');
        }

        const channelDtos = channels.map((channel) => {
            return ChannelDto.objectFromModel(channel);
        });

        return channelDtos;
    },

    async update({ userId, channelId, newValues }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedChannel = await ChannelModel.findByIdAndUpdate(
                    channelId, 
                    newValues, 
                    queryOptions({ new: true }),
                );
                if (!updatedChannel) {
                    throw ApiError.badRequest('Не удалось обновить канал');
                }

                const updatedChannelDto = ChannelDto.objectFromModel(updatedChannel);

                onCommit(() => {
                    subscription.channels.update({ entity: updatedChannelDto });
                });

                return updatedChannelDto;
            },
        );
    },

    async delete({ channelId }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const deletedChannel = await ChannelModel.findByIdAndDelete(channelId, queryOptions());
                if (!deletedChannel) {
                    throw ApiError.badRequest('Не удалось удалить канал');
                }

                await UserServiceHelpers.removeChannelFromMany({ channelId });
                await RoleServiceHelpers.deleteManyByChannelId({ channelId });
                await TextRoomServiceHelpers.deleteManyByChannelId({ channelId });
                

                const deletedChannelDto = ChannelDto.objectFromModel(deletedChannel);
                return deletedChannelDto;
            },
        );
    },
};