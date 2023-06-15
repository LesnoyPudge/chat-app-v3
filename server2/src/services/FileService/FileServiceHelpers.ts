import { FileModel, transactionContainer } from '@database';
import { ApiError } from '@errors';
import { defaultAvatar, Entities, Id } from '@shared';
import { FilterQuery } from 'mongoose';



export const FileServiceHelpers = {
    async create(values: Entities.File.Encoded) {
        return transactionContainer(
            async({ session }) => {
                const file = await FileModel.create([values], { session }).then((v) => v[0]);
                return file.toObject();
            },
        );
    },
    
    async getOne(filter: FilterQuery<Entities.File.Default>) {
        const file = await FileModel.findOne(filter).lean();
        return file;
    },

    async getMany(filter: FilterQuery<Entities.File.Default>) {
        const files = await FileModel.find(filter).lean();
        return files;
    },

    async delete(fileId: Id | null) {
        return transactionContainer(
            async({ session }) => {
                if (!fileId) return;
                if (defaultAvatar.isAvatar(fileId)) return;

                const fileToDelete = await FileModel.findOne({ id: fileId });

                if (!fileToDelete) throw ApiError.internal();

                if (!fileToDelete.isDeletable) return;

                await fileToDelete.deleteOne({ session });
            },
        );
    },

    async isExist(filter: FilterQuery<Entities.File.Default>) {
        return !!await FileModel.exists(filter).lean();
    },
};