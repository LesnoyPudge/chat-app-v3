import { model, Schema, SchemaTypes, Types } from 'mongoose';
import { PrivateChannel } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { MODEL_NAME } from 'src/database/modelName';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const PrivateChannelSchema = new Schema<PrivateChannel>({
    id: { type: SchemaTypes.String },
    activeMembers: [{ type: SchemaTypes.String, ref: MODEL_NAME.USER }],
    members: [{ type: SchemaTypes.String, ref: MODEL_NAME.USER }],
    chat: {
        id: {
            type: SchemaTypes.String,
            default: new Types.ObjectId().toString(),
        },
        messages: [{
            type: SchemaTypes.String, 
            ref: MODEL_NAME.MESSAGE,
        }],
    },
    createdAt: { type: SchemaTypes.Number, default: Date.now },
}, getSchemaOptions());

withPreSaveHook(PrivateChannelSchema);

export const PrivateChannelModel = model(MODEL_NAME.PRIVATE_CHANNEL, PrivateChannelSchema, MODEL_NAME.MESSAGE);
