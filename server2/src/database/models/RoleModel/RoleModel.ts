import { model, Schema, SchemaTypes } from 'mongoose';
import { Role } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { MODEL_NAME } from 'src/database/modelName';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const RoleSchema = new Schema<Role>({
    id: { type: SchemaTypes.String },
    channel: { type: SchemaTypes.String, ref: MODEL_NAME.CHANNEL, required: true },
    image: { type: SchemaTypes.String, ref: MODEL_NAME.FILE, required: true },
    name: { type: SchemaTypes.String, required: true },
    color: { type: SchemaTypes.String, default: '#99aab5' },
    isDefault: { type: SchemaTypes.Boolean, default: false },
    order: { type: SchemaTypes.Number, default: -1 },
    users: [{ type: SchemaTypes.String, ref: MODEL_NAME.USER }],
    permissions: {
        channelControl: { type: SchemaTypes.Boolean, default: false },
        roomControl: { type: SchemaTypes.Boolean, default: false },
        createInvitation: { type: SchemaTypes.Boolean, default: true },
        kickMember: { type: SchemaTypes.Boolean, default: false },
        banMember: { type: SchemaTypes.Boolean, default: false },
        sendMessage: { type: SchemaTypes.Boolean, default: true },
        isAdministrator: { type: SchemaTypes.Boolean, default: false },
    },
    createdAt: { type: SchemaTypes.Number, default: Date.now },
}, getSchemaOptions());

withPreSaveHook(RoleSchema);

export const RoleModel = model(MODEL_NAME.ROLE, RoleSchema, MODEL_NAME.ROLE);
