import { model, Schema, SchemaTypes } from 'mongoose';
import { Entities, ENTITY_NAMES } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const PrivateChannelSchema = new Schema<Entities.PrivateChannel.Default>({
    id: { type: SchemaTypes.String },
    members: [{ type: SchemaTypes.String, ref: ENTITY_NAMES.USER }],
    chat: { type: SchemaTypes.String, ref: ENTITY_NAMES.CHAT, required: true },
    createdAt: { type: SchemaTypes.Number, default: Date.now },
}, getSchemaOptions());

withPreSaveHook(PrivateChannelSchema);

export const PrivateChannelModel = model(ENTITY_NAMES.PRIVATE_CHANNEL, PrivateChannelSchema, ENTITY_NAMES.MESSAGE);
