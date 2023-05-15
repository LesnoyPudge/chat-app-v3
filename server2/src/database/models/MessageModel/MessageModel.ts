import { model, Schema, SchemaTypes } from 'mongoose';
import { Message } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { MODEL_NAME } from 'src/database/modelName';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const MessageSchema = new Schema<Message>({
    id: { type: SchemaTypes.String },
    chat: { type: SchemaTypes.String, required: true },
    user: { type: SchemaTypes.String, ref: MODEL_NAME.USER, required: true },
    content: { type: SchemaTypes.String, default: '' },
    isChanged: { type: SchemaTypes.Boolean, default: false },
    isDeleted: { type: SchemaTypes.Boolean, default: false },
    attachments: [{
        type: SchemaTypes.String,
        ref: MODEL_NAME.FILE,
    }],
    updatedAt: { type: SchemaTypes.Number, default: Date.now },
    createdAt: { type: SchemaTypes.Number, default: Date.now },
}, getSchemaOptions());

withPreSaveHook(MessageSchema);

export const MessageModel = model(MODEL_NAME.MESSAGE, MessageSchema, MODEL_NAME.MESSAGE);
