import { model, Schema, SchemaTypes } from 'mongoose';
import { Entities, MODEL_NAMES } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const MessageSchema = new Schema<Entities.Message.Default>({
    id: { type: SchemaTypes.String },
    chat: { type: SchemaTypes.String, required: true },
    user: { type: SchemaTypes.String, ref: MODEL_NAMES.USER, required: true },
    content: { type: SchemaTypes.String, default: '' },
    isChanged: { type: SchemaTypes.Boolean, default: false },
    isDeleted: { type: SchemaTypes.Boolean, default: false },
    attachments: [{
        id: {
            type: SchemaTypes.String,
            ref: MODEL_NAMES.FILE,
            required: true,
        },
        name: {
            type: SchemaTypes.String,
            required: true,
        },
        type: {
            type: SchemaTypes.String,
            required: true,
        },
        size: {
            type: SchemaTypes.Number,
            required: true,
        },
    }],
    updatedAt: { type: SchemaTypes.Number, default: Date.now },
    createdAt: { type: SchemaTypes.Number, default: Date.now },
}, getSchemaOptions());

withPreSaveHook(MessageSchema);

export const MessageModel = model(MODEL_NAMES.MESSAGE, MessageSchema, MODEL_NAMES.MESSAGE);
