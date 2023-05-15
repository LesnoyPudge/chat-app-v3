import { model, Schema, SchemaTypes, Types } from 'mongoose';
import { Room } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { MODEL_NAME } from 'src/database/modelName';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const RoomSchema = new Schema<Room>({
    id: { type: SchemaTypes.String },
    name: { type: SchemaTypes.String, required: true },
    type: { type: SchemaTypes.String, default: 'text' },
    isPrivate: { type: SchemaTypes.Boolean, default: false },
    channel: { type: SchemaTypes.String, ref: MODEL_NAME.CHANNEL, required: true },
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
    whiteList: {
        users: [{ type: SchemaTypes.String, ref: MODEL_NAME.USER }],
        roles: [{ type: SchemaTypes.String, ref: MODEL_NAME.ROLE }],
    },
    createdAt: { type: SchemaTypes.Number, default: Date.now },
}, getSchemaOptions());

withPreSaveHook(RoomSchema);

export const RoomModel = model(MODEL_NAME.ROOM, RoomSchema, MODEL_NAME.ROOM);