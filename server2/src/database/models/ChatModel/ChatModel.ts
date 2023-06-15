import { model, Schema, SchemaTypes } from 'mongoose';
import { Entities } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { MODEL_NAME } from 'src/database/modelName';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const ChatSchema = new Schema<Entities.Chat.Default>({
    id: { type: SchemaTypes.String },
    privateChannel: { type: SchemaTypes.String, ref: MODEL_NAME.PRIVATE_CHANNEL },
    room: { type: SchemaTypes.String, ref: MODEL_NAME.ROOM },
    messages: [{ type: SchemaTypes.String, ref: MODEL_NAME.MESSAGE }],
}, getSchemaOptions());

withPreSaveHook(ChatSchema);

export const ChatModel = model(MODEL_NAME.CHAT, ChatSchema, MODEL_NAME.CHAT);
