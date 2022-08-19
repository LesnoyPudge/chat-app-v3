import { Schema, model, Types, Document } from 'mongoose';
import { ChatSchema, IChatSchema } from '@models/schemas';



export interface IPrivateChannelModel extends Document<Types.ObjectId> {
    members: Types.ObjectId[];
    activeMembers: Types.ObjectId[];
    chat: IChatSchema;
    createdAt: Date;
    updatedAt: Date;
}

const PrivateChannelSchema = new Schema<IPrivateChannelModel>(
    {
        members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        activeMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        chat: {
            type: ChatSchema,
            default: () => ({}),
        },
    },
    { 
        timestamps: true, 
    },
);

export const PrivateChannelModel = model<IPrivateChannelModel>('PrivateChannel', PrivateChannelSchema, 'PrivateChannel');