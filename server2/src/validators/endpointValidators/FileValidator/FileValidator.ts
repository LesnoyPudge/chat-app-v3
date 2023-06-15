import { Endpoints, Prettify } from '@shared';
import { chainPresets } from 'src/validators/chainPresets';
import { createValidator } from 'src/validators/createValidator';
import { customChains } from 'src/validators/customChains';
import { extendedValidator } from 'src/validators/extendedValidator';



type FileEndpointsSchema = {
    [Endpoints.V1.File.Read.ActionName]: Prettify<
        Endpoints.V1.File.Read.RequestBody
    >,

    [Endpoints.V1.File.Download.ActionName]: Prettify<
        Endpoints.V1.File.Download.RequestBody
    >,
}

const { body } = extendedValidator;

export const FileValidator = createValidator<FileEndpointsSchema>({
    read: () => ({
        fileId: (
            body('fileId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._fileExistsById()
        ),
    }),
    
    download: () => ({
        fileId: (
            body('fileId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._fileExistsById()
        ),
    }),
});