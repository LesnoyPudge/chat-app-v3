import { model, Schema, SchemaTypes } from 'mongoose';
import { Channel } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { MODEL_NAME } from 'src/database/modelName';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const ChannelSchema = new Schema<Channel>({
    id: { type: SchemaTypes.String },
    identifier: { type: SchemaTypes.String, required: true, unique: true, lowercase: true },
    name: { type: SchemaTypes.String, required: true },
    owner: { type: SchemaTypes.String, ref: MODEL_NAME.USER, required: true },
    avatar: { type: SchemaTypes.String, ref: MODEL_NAME.FILE, default: null },
    isPrivate: { type: SchemaTypes.Boolean, default: false },
    members: [{ type: SchemaTypes.String, ref: MODEL_NAME.USER }],
    roles: [{ type: SchemaTypes.String, ref: MODEL_NAME.ROLE }],
    rooms: [{ type: SchemaTypes.String, ref: MODEL_NAME.ROOM }],
    invitations: [{
        creator: { type: SchemaTypes.String, ref: MODEL_NAME.USER },
        code: { type: SchemaTypes.String },
        expiryTimestamp: { type: SchemaTypes.String, default: null },
        createdAt: { type: SchemaTypes.Number, default: Date.now },
    }],
    banList: [{
        user: { type: SchemaTypes.String, ref: MODEL_NAME.USER },
        reason: { type: SchemaTypes.String, default: null },
    }],
    createdAt: { type: SchemaTypes.Number, default: Date.now },
}, getSchemaOptions());

withPreSaveHook(ChannelSchema);

export const ChannelModel = model(MODEL_NAME.CHANNEL, ChannelSchema, MODEL_NAME.CHANNEL);
