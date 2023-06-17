import { model, Schema, SchemaTypes } from 'mongoose';
import { Entities, ENTITY_NAMES } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const ChatSchema = new Schema<Entities.Chat.Default>({
    id: { type: SchemaTypes.String },
    privateChannel: { type: SchemaTypes.String, ref: ENTITY_NAMES.PRIVATE_CHANNEL },
    room: { type: SchemaTypes.String, ref: ENTITY_NAMES.ROOM },
    messages: [{ type: SchemaTypes.String, ref: ENTITY_NAMES.MESSAGE }],
}, getSchemaOptions());

withPreSaveHook(ChatSchema);

export const ChatModel = model(ENTITY_NAMES.CHAT, ChatSchema, ENTITY_NAMES.CHAT);
