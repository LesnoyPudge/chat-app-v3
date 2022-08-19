import { Schema, Types, Document } from 'mongoose';



export interface IChatSchema extends Document<Types.ObjectId> {
    messages: Types.ObjectId[];
}

export const ChatSchema = new Schema<IChatSchema>(
    {
        messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    },
);