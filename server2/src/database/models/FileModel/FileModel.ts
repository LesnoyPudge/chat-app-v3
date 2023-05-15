import { model, Schema, SchemaTypes } from 'mongoose';
import { File } from '@shared';
import { getSchemaOptions } from 'src/database/getSchemaOptions';
import { MODEL_NAME } from 'src/database/modelName';
import { withPreSaveHook } from 'src/database/withPreSaveHook';



const FileSchema = new Schema<File>({
    id: { type: SchemaTypes.String },
    isDeletable: { type: SchemaTypes.Boolean, default: true },
    filename: { type: SchemaTypes.String, required: true },
    base64url: { type: SchemaTypes.String, required: true },
    createdAt: { type: SchemaTypes.Number, default: Date.now },
}, getSchemaOptions());

withPreSaveHook(FileSchema);

export const FileModel = model(MODEL_NAME.FILE, FileSchema, MODEL_NAME.MESSAGE);
