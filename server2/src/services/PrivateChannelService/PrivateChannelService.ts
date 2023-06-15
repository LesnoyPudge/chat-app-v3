import { PrivateChannelModel, transactionContainer } from '@database';
import { ApiError } from '@errors';
import { Endpoints } from '@shared';
import { AuthorizedService } from '@types';
import { ChatServiceHelpers, UserServiceHelpers } from '@services';



interface PrivateChannelService {
    [Endpoints.V1.PrivateChannel.Create.ActionName]: AuthorizedService<
        Endpoints.V1.PrivateChannel.Create.RequestBody,
        Endpoints.V1.PrivateChannel.Create.Response
    >;
    [Endpoints.V1.PrivateChannel.GetOne.ActionName]: AuthorizedService<
        Endpoints.V1.PrivateChannel.GetOne.RequestBody,
        Endpoints.V1.PrivateChannel.GetOne.Response
    >;
}

export const PrivateChannelService: PrivateChannelService = {
    async create({ id }, { targetId }) {
        return transactionContainer(
            async({ session }) => {
                const privateChannel = new PrivateChannelModel({
                    members: [id, targetId],
                });
                
                const chat = await ChatServiceHelpers.create({
                    room: null,
                    privateChannel: privateChannel.id,
                });

                privateChannel.chat = chat.id;

                const savedPrivateChannel = await privateChannel.save({ session });

                await UserServiceHelpers.addPrivateChannel({
                    userId: id, 
                    privateChannelId: privateChannel.id,
                });

                await UserServiceHelpers.addPrivateChannel({
                    userId: targetId, 
                    privateChannelId: privateChannel.id,
                });

                return savedPrivateChannel;
            },
        );
    },

    async getOne(_, { privateChannelId }) {
        const privateChannel = await PrivateChannelModel.findOne(
            { id: privateChannelId },
        ).lean();

        if (!privateChannel) throw ApiError.internal();

        return privateChannel;
    },
};