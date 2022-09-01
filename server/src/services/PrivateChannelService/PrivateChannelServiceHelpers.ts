import { PrivateChannelDto } from '@dtos';
import { IPrivateChannelModel, PrivateChannelModel } from '@models';
import { subscription } from '@subscription';
import { objectId, transactionContainer } from '@utils';
import { FilterQuery, Types } from 'mongoose';



const { toObjectId } = objectId;

export const PrivateChannelServiceHelpers = {
    async addMessage({ chatId, messageId }: {chatId: string | Types.ObjectId, messageId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedPrivateChannel = await PrivateChannelModel.findOneAndUpdate(
                    { 'chat._id': chatId }, 
                    { $push: { 'chat.messages': toObjectId(messageId) } }, 
                    queryOptions(),
                );

                onCommit(() => {
                    subscription.privateChannels.update({ 
                        entity: PrivateChannelDto.objectFromModel(updatedPrivateChannel), 
                    });
                });

                return updatedPrivateChannel;
            },
        );
    },

    async isExist(filter: FilterQuery<IPrivateChannelModel>) {
        return !!await PrivateChannelModel.exists(filter); 
    },
};