import { ChannelDto } from '@dtos';
import { ChannelModel } from '@models';
import { subscription } from '@subscription';
import { objectId, transactionContainer } from '@utils';
import { Types } from 'mongoose';



const { toObjectId } = objectId;

export const ChannelServiceHelpers = {
    async addTextRoom({ channelId, textRoomId }: 
        {
            channelId: string | Types.ObjectId, 
            textRoomId: string | Types.ObjectId
        },
    ) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedChannel = await ChannelModel.findByIdAndUpdate(
                    channelId, 
                    { $push: { textRooms: toObjectId(textRoomId) } },
                    queryOptions({ new: true }),
                );

                onCommit(() => {
                    subscription.channels.update({ entity: ChannelDto.objectFromModel(updatedChannel) });
                });

                return updatedChannel;
            },
        );
    },

    async removeTextRoom({ textRoomId }: { textRoomId: string | Types.ObjectId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedChannel = await ChannelModel.findOneAndUpdate(
                    { textRooms: textRoomId }, 
                    { $pull: { textRooms: textRoomId } }, 
                    queryOptions({ new: true }),
                );
                
                onCommit(() => {
                    subscription.channels.update({ entity: ChannelDto.objectFromModel(updatedChannel) });
                });

                return updatedChannel;
            },
        );
    },

    async addRole({ channelId, roleId }: {channelId: string | Types.ObjectId, roleId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedChannel = await ChannelModel.findByIdAndUpdate(
                    channelId,
                    { $push: { roles: toObjectId(roleId) } },
                    queryOptions({ new: true }),
                );

                onCommit(() => {
                    subscription.channels.update({ entity: ChannelDto.objectFromModel(updatedChannel) });
                });

                return updatedChannel;
            },
        );
    },

    async removeRole({ roleId }: {roleId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedChannel = await ChannelModel.findOneAndUpdate(
                    { roles: roleId },
                    { $pull: { roles: toObjectId(roleId) } }, 
                    queryOptions({ new: true }),
                );

                onCommit(() => {
                    subscription.channels.update({ entity: ChannelDto.objectFromModel(updatedChannel) });
                });

                return updatedChannel;
            },
        );
    },
};