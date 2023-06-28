import { model, Schema, SchemaTypes } from 'mongoose';
import { Entities, MODEL_NAMES } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const RoleSchema = new Schema<Entities.Role.Default>({
    id: { type: SchemaTypes.String },
    channel: { type: SchemaTypes.String, ref: MODEL_NAMES.CHANNEL, required: true },
    image: { type: SchemaTypes.String, ref: MODEL_NAMES.FILE, default: null },
    name: { type: SchemaTypes.String, required: true },
    color: { type: SchemaTypes.String, default: '#99aab5' },
    isDefault: { type: SchemaTypes.Boolean, default: false },
    order: { type: SchemaTypes.Number, required: true },
    users: [{ type: SchemaTypes.String, ref: MODEL_NAMES.USER }],
    permissions: {
        channelControl: { type: SchemaTypes.Boolean, default: false },
        roomControl: { type: SchemaTypes.Boolean, default: false },
        createInvitation: { type: SchemaTypes.Boolean, default: true },
        kickMember: { type: SchemaTypes.Boolean, default: false },
        banMember: { type: SchemaTypes.Boolean, default: false },
        isAdministrator: { type: SchemaTypes.Boolean, default: false },
    },
    createdAt: { type: SchemaTypes.Number, default: Date.now },
}, getSchemaOptions());

withPreSaveHook(RoleSchema);

export const RoleModel = model(MODEL_NAMES.ROLE, RoleSchema, MODEL_NAMES.ROLE);
