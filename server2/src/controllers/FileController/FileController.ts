import { ApiError } from '@errors';
import { FileServiceHelpers } from '@services';
import { Endpoints } from '@shared';
import { AuthorizedMiddleware } from '@types';



interface FileController {
    [Endpoints.V1.File.Download.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.File.Download.RequestBody,
        Buffer
    >;
    [Endpoints.V1.File.Read.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.File.Read.RequestBody,
        Buffer
    >;
}

export const FileController: FileController = {
    async download(req, res) {
        const file = await FileServiceHelpers.getOne({ id: req.body.fileId });
        if (!file) throw ApiError.internal();

        const base64Data = file.base64.split(';base64,')[1];
        const fileBuffer = Buffer.from(base64Data, 'base64');

        res.attachment(file.name);
        res.setHeader('Content-Type', file.type);
        res.send(fileBuffer);
    },

    async read(req, res) {
        const file = await FileServiceHelpers.getOne({ id: req.body.fileId });
        if (!file) throw ApiError.internal();

        const base64Data = file.base64.split(';base64,')[1];
        const fileBuffer = Buffer.from(base64Data, 'base64');

        res.setHeader('Content-Type', file.type);
        res.send(fileBuffer);
    },
};