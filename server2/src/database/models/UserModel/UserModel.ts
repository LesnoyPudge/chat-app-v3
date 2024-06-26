import { model, Schema, SchemaTypes } from 'mongoose';
import { Entities, MODEL_NAMES } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const UserSchema = new Schema<Entities.User.Default>({
    id: { type: SchemaTypes.String },
    login: { type: SchemaTypes.String, required: true, unique: true, lowercase: true },
    password: { type: SchemaTypes.String, required: true },
    username: { type: SchemaTypes.String, required: true },
    avatarId: { type: SchemaTypes.String, required: true },
    email: { type: SchemaTypes.String, default: null },
    accessCode: {
        code: { type: SchemaTypes.String, required: true },
        expiresAt: { type: SchemaTypes.Number, required: true },
    },
    refreshToken: { type: SchemaTypes.String, required: true },
    settings: {
        theme: { type: SchemaTypes.String, default: 'auto' },
        fontSize: { type: SchemaTypes.Number, default: 16 },
        messageGroupSpacing: { type: SchemaTypes.Number, default: 20 },
        messageDisplayMode: { type: SchemaTypes.String, default: 'cozy' },
    },
    isActivated: { type: SchemaTypes.Boolean, default: false },
    isDeleted: { type: SchemaTypes.Boolean, default: false },
    extraStatus: { type: SchemaTypes.String, default: 'default' },
    channels: [{ type: SchemaTypes.String, ref: MODEL_NAMES.CHANNEL }],
    privateChannels: [{
        id: { type: SchemaTypes.String, ref: MODEL_NAMES.PRIVATE_CHANNEL },
        hidden: { type: SchemaTypes.Boolean, default: false },
    }],
    friends: [{ type: SchemaTypes.String, ref: MODEL_NAMES.USER }],
    blocked: [{ type: SchemaTypes.String, ref: MODEL_NAMES.USER }],
    friendRequests: {
        incoming: [{
            from: { type: SchemaTypes.String, ref: MODEL_NAMES.USER },
            createdAt: { type: SchemaTypes.Number, default: Date.now },
        }],
        outgoing: [{
            to: { type: SchemaTypes.String, ref: MODEL_NAMES.USER },
            createdAt: { type: SchemaTypes.Number, default: Date.now },
        }],
    },
    createdAt: { type: SchemaTypes.Number, default: Date.now },
}, getSchemaOptions());

withPreSaveHook(UserSchema);

export const UserModel = model(MODEL_NAMES.USER, UserSchema, MODEL_NAMES.USER);
