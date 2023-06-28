import { model, Schema, SchemaTypes } from 'mongoose';
import { Entities, MODEL_NAMES } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const ChatSchema = new Schema<Entities.Chat.Default>({
    id: { type: SchemaTypes.String },
    ownerId: { type: SchemaTypes.String },
    owner: { type: SchemaTypes.String, required: true },
    messages: [{ type: SchemaTypes.String, ref: MODEL_NAMES.MESSAGE }],
}, getSchemaOptions());

withPreSaveHook(ChatSchema);

export const ChatModel = model(MODEL_NAMES.CHAT, ChatSchema, MODEL_NAMES.CHAT);
