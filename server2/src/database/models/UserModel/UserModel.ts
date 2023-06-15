import { model, Schema, SchemaTypes } from 'mongoose';
import { Entities } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { MODEL_NAME } from 'src/database/modelName';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const UserSchema = new Schema<Entities.User.Default>({
    id: { type: SchemaTypes.String },
    login: { type: SchemaTypes.String, required: true, unique: true, lowercase: true },
    password: { type: SchemaTypes.String, required: true },
    username: { type: SchemaTypes.String, required: true },
    avatar: { type: SchemaTypes.String, required: true },
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
    },
    isActivated: { type: SchemaTypes.Boolean, default: false },
    isDeleted: { type: SchemaTypes.Boolean, default: false },
    extraStatus: { type: SchemaTypes.String, default: 'default' },
    channels: [{ type: SchemaTypes.String, ref: MODEL_NAME.CHANNEL }],
    privateChannels: [{ 
        id: { type: SchemaTypes.String, ref: MODEL_NAME.PRIVATE_CHANNEL },
        hidden: { type: SchemaTypes.Boolean, default: false },
    }],
    friends: [{ type: SchemaTypes.String, ref: MODEL_NAME.USER }],
    blocked: [{ type: SchemaTypes.String, ref: MODEL_NAME.USER }],
    friendRequests: {
        incoming: [{
            from: { type: SchemaTypes.String, ref: MODEL_NAME.USER },
            createdAt: { type: SchemaTypes.Number, default: Date.now },
        }],
        outgoing: [{
            to: { type: SchemaTypes.String, ref: MODEL_NAME.USER },
            createdAt: { type: SchemaTypes.Number, default: Date.now },
        }],
    },
    createdAt: { type: SchemaTypes.Number, default: Date.now },
}, getSchemaOptions());

withPreSaveHook(UserSchema);

export const UserModel = model(MODEL_NAME.USER, UserSchema, MODEL_NAME.USER);
