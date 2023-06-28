import { model, Schema, SchemaTypes } from 'mongoose';
import { Entities, MODEL_NAMES } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const ChannelSchema = new Schema<Entities.Channel.Default>({
    id: { type: SchemaTypes.String },
    identifier: { type: SchemaTypes.String, required: true, unique: true, lowercase: true },
    name: { type: SchemaTypes.String, required: true },
    owner: { type: SchemaTypes.String, ref: MODEL_NAMES.USER, required: true },
    avatar: { type: SchemaTypes.String, ref: MODEL_NAMES.FILE, default: null },
    isPrivate: { type: SchemaTypes.Boolean, default: false },
    members: [{ type: SchemaTypes.String, ref: MODEL_NAMES.USER }],
    roles: [{ type: SchemaTypes.String, ref: MODEL_NAMES.ROLE }],
    rooms: [{ type: SchemaTypes.String, ref: MODEL_NAMES.ROOM }],
    invitations: [{
        creator: { type: SchemaTypes.String, ref: MODEL_NAMES.USER },
        code: { type: SchemaTypes.String },
        expiryTimestamp: { type: SchemaTypes.String, default: null },
        createdAt: { type: SchemaTypes.Number, default: Date.now },
    }],
    banned: [{
        user: { type: SchemaTypes.String, ref: MODEL_NAMES.USER },
        reason: { type: SchemaTypes.String, default: null },
    }],
    createdAt: { type: SchemaTypes.Number, default: Date.now },
}, getSchemaOptions());

withPreSaveHook(ChannelSchema);

export const ChannelModel = model(MODEL_NAMES.CHANNEL, ChannelSchema, MODEL_NAMES.CHANNEL);
