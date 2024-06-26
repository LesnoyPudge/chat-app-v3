import { Schema, model, Types, Document } from 'mongoose';



export interface IRoleModel extends Document<Types.ObjectId> {
    name: string;
    channel: Types.ObjectId;
    users: Types.ObjectId[];
    isDefault: boolean;
    color: string;
    image: string;
    order: number;
    permissions: {
        channelControl: boolean;
        roomControl: boolean;
        createInvitation: boolean;
        kickMember: boolean;
        banMember: boolean;
        sendMessage: boolean;
        isAdministrator: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}

const RoleSchema = new Schema<IRoleModel>(
    {
        name: { type: String, required: true },
        channel: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },
        users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        isDefault: { type: Boolean, default: false },
        color: { type: String, default: '#99aab5' },
        image: { type: String, default: '' },
        order: { type: Number, default: -1 },
        permissions: {
            channelControl: { type: Boolean, default: false },
            roomControl: { type: Boolean, default: false },
            createInvitation: { type: Boolean, default: true },
            kickMember: { type: Boolean, default: false },
            banMember: { type: Boolean, default: false },
            sendMessage: { type: Boolean, default: true },
            isAdministrator: { type: Boolean, default: false },
        },
    },
    { 
        timestamps: true, 
    },
);

export const RoleModel = model<IRoleModel>('Role', RoleSchema, 'Role');