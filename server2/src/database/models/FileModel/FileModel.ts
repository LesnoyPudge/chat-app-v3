import { model, Schema, SchemaTypes } from 'mongoose';
import { Entities, MODEL_NAMES } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const FileSchema = new Schema<Entities.File.Default>({
    id: { type: SchemaTypes.String },
    isDeletable: { type: SchemaTypes.Boolean, default: true },
    name: { type: SchemaTypes.String, required: true },
    base64: { type: SchemaTypes.String, required: true },
    size: { type: SchemaTypes.Number, required: true },
    type: { type: SchemaTypes.String, required: true },
    createdAt: { type: SchemaTypes.Number, default: Date.now },
}, getSchemaOptions());

withPreSaveHook(FileSchema);

export const FileModel = model(MODEL_NAMES.FILE, FileSchema, MODEL_NAMES.FILE);
