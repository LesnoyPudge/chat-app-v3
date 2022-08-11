import { PrivateChannelDto } from '@dtos';
import { MessageModel, PrivateChannelModel, UserModel } from '@models';
import { AuthorizedServiceType, ICreatePrivateChannelRequest, ILeavePrivateChannelRequest, IGetManyPrivateChannelsRequest, IGetOnePrivateChannelRequest, IPrivateChannel, IUpdatePrivateChannelRequest } from '@types';
import { ApiError, toObjectId, transactionContainer } from '@utils';



interface IPrivateChannelService {
    create: AuthorizedServiceType<ICreatePrivateChannelRequest, IPrivateChannel>;
    getOne: AuthorizedServiceType<IGetOnePrivateChannelRequest, IPrivateChannel>;
    getMany: AuthorizedServiceType<IGetManyPrivateChannelsRequest, IPrivateChannel[]>;
    update: AuthorizedServiceType<IUpdatePrivateChannelRequest, IPrivateChannel>;
    leave: AuthorizedServiceType<ILeavePrivateChannelRequest, IPrivateChannel>;
}

export const PrivateChannelService: IPrivateChannelService = {
    async create({ userId, targetId }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const existingPrivateChannel = await PrivateChannelModel.findOne({ $in: { members: [userId, targetId] } });
                console.log('userId:', userId, 'targetId:', targetId);
                if (existingPrivateChannel) {
                    const myId = toObjectId(userId);
                    const isActiveMember = existingPrivateChannel.activeMembers.includes(myId);
                    console.log('канал сущестует');
                    

                    if (isActiveMember) {
                        const existingPrivateChannelDto = PrivateChannelDto.objectFromModel(existingPrivateChannel);
                        console.log('уже activeMember, возвращаю');
                        return existingPrivateChannelDto;
                    }
                    
                    const updatedPrivateChannel = await PrivateChannelModel.findByIdAndUpdate(
                        existingPrivateChannel._id,
                        { $push: { activeMembers: myId } },
                        queryOptions({ new: true }),
                    );
    
                    await UserModel.updateOne(
                        { _id: userId }, 
                        { $push: { privateChannels: updatedPrivateChannel._id } },
                        queryOptions(),
                    );
                    console.log('не activeMember, добавляюсь');
                    const updatedPrivateChannelDto = PrivateChannelDto.objectFromModel(updatedPrivateChannel);
                    return updatedPrivateChannelDto;
                    
                }
                console.log('канала нет, создаю');
                const privateChannel = await PrivateChannelModel.create(
                    [{
                        members: [
                            userId,
                            targetId,
                        ],
                        activeMembers: [
                            userId,
                        ],
                    }],
                    queryOptions(),
                ).then((privateChannels) => privateChannels[0]);
                
                if (!privateChannel) {
                    throw ApiError.badRequest('Не удалось создать канал');
                }

                await UserModel.updateOne(
                    { _id: userId }, 
                    { $push: { privateChannels: privateChannel._id } },
                    queryOptions(),
                );
                
                const privateChannelDto = PrivateChannelDto.objectFromModel(privateChannel);
                return privateChannelDto;
            },
        );
    },

    async getOne({ userId, privateChannelId }) {
        const privateChannel = await PrivateChannelModel.findById(privateChannelId, {}, { lean: true });
        if (!privateChannel) throw ApiError.badRequest('Канал не найден');

        const privateChannelDto = PrivateChannelDto.objectFromModel(privateChannel);
        return privateChannelDto;
    },

    async getMany({ userId, privateChannelIds }) {
        const privateChannels = await PrivateChannelModel.find({ _id: { $in: privateChannelIds } }, {}, { lean: true });
        if (!privateChannels.length) {
            throw ApiError.badRequest('Каналы не найдены');
        }

        const privateChannelDtos = privateChannels.map((privateChannel) => {
            return PrivateChannelDto.objectFromModel(privateChannel);
        });

        return privateChannelDtos;
    },

    async update({ userId, privateChannelId, newValues }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedPrivateChannel = await PrivateChannelModel.findByIdAndUpdate(
                    privateChannelId,
                    newValues,
                    queryOptions({ new: true }),
                );
                if (!updatedPrivateChannel) throw ApiError.badRequest('Не удалось обновить канал');

                const updatedPrivateChannelDto = PrivateChannelDto.objectFromModel(updatedPrivateChannel);

                onCommit(() => {
                    // PrivateChannelSubscription.update({ userId, privateChannel: updatedPrivateChannelDto });
                });

                return updatedPrivateChannelDto;
            },
        );
    },

    async leave({ userId, privateChannelId }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const updatedPrivateChannel = await PrivateChannelModel.findByIdAndUpdate(
                    privateChannelId,
                    {
                        $pull: { activeMembers: userId },
                    },
                    queryOptions({ new: true }),
                );
                if (!updatedPrivateChannel) {
                    throw ApiError.badRequest('Канал не найден');
                }

                if (updatedPrivateChannel.activeMembers.length === 0) {
                    const deleted = await PrivateChannelModel.findOneAndDelete({ _id: privateChannelId }, queryOptions());
                    console.log('channel deleted:', deleted);
                    await MessageModel.deleteMany({ chat: updatedPrivateChannel.chat.id }, queryOptions());
                }

                await UserModel.updateOne(
                    { _id: userId }, 
                    { $pull: { privateChannels: privateChannelId } }, 
                    queryOptions(),
                );

                const updatedPrivateChannelDto = PrivateChannelDto.objectFromModel(updatedPrivateChannel);
                
                return updatedPrivateChannelDto;
            },
        );
    },
};