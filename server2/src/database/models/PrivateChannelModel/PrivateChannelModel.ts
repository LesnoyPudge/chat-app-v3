import { model, Schema, SchemaTypes } from 'mongoose';
import { Entities } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { MODEL_NAME } from 'src/database/modelName';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const PrivateChannelSchema = new Schema<Entities.PrivateChannel.Default>({
    id: { type: SchemaTypes.String },
    members: [{ type: SchemaTypes.String, ref: MODEL_NAME.USER }],
    chat: { type: SchemaTypes.String, ref: MODEL_NAME.CHAT, required: true },
    createdAt: { type: SchemaTypes.Number, default: Date.now },
}, getSchemaOptions());

withPreSaveHook(PrivateChannelSchema);

export const PrivateChannelModel = model(MODEL_NAME.PRIVATE_CHANNEL, PrivateChannelSchema, MODEL_NAME.MESSAGE);
