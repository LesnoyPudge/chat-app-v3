import { model, Schema, SchemaTypes } from 'mongoose';
import { Entities, MODEL_NAMES } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const RoomSchema = new Schema<Entities.Room.Default>({
    id: { type: SchemaTypes.String },
    name: { type: SchemaTypes.String, required: true },
    type: { type: SchemaTypes.String, default: 'text' },
    isPrivate: { type: SchemaTypes.Boolean, default: false },
    channel: { type: SchemaTypes.String, ref: MODEL_NAMES.CHANNEL, required: true },
    chat: { type: SchemaTypes.String, ref: MODEL_NAMES.CHAT, required: true },
    whiteList: {
        users: [{ type: SchemaTypes.String, ref: MODEL_NAMES.USER }],
        roles: [{ type: SchemaTypes.String, ref: MODEL_NAMES.ROLE }],
    },
    createdAt: { type: SchemaTypes.Number, default: Date.now },
}, getSchemaOptions());

withPreSaveHook(RoomSchema);

export const RoomModel = model(MODEL_NAMES.ROOM, RoomSchema, MODEL_NAMES.ROOM);
