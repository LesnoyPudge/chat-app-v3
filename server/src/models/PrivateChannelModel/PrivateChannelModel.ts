import { Schema, model, Types, Document } from 'mongoose';



interface IChatSchema extends Document<Types.ObjectId> {
    messages: Types.ObjectId[];
}

export interface IPrivateChannelModel extends Document<Types.ObjectId> {
    members: Types.ObjectId[];
    activeMembers: Types.ObjectId[];
    chat: IChatSchema;
    createdAt: Date;
    updatedAt: Date;
}

const ChatSchema = new Schema(
    {
        messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    },
);

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

export const PrivateChannelModel = model<IPrivateChannelModel>('PrivateChannel', PrivateChannelSchema);