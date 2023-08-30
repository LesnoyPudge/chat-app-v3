import { extendedValidator } from 'src/validators/extendedValidator';
import { Entities, MBToBytes } from '@shared';
import { fromBuffer } from 'file-type';
import isSvg from 'is-svg';



const { body } = extendedValidator;

const nullable = (disabled = false) => {
    if (disabled) return;

    return {
        values: 'null',
    } as const;
};

export const chainPresets = {
    validEncodedFile(field: string, notNullable = false) {
        return [
            body(field)
                .optional(nullable(notNullable))
                .isObject({ strict: true }),

            body(`${field}.base64`)
                .if(body(field).exists(nullable(notNullable)))
                .exists()
                .isString()
                .notEmpty()
                .isDataURI(),

            body(`${field}.name`)
                .if(body(field).exists(nullable(notNullable)))
                .exists()
                .isString()
                ._sanitize()
                .notEmpty(),

            body(`${field}.size`)
                .if(body(field).exists(nullable(notNullable)))
                .exists()
                .isInt({
                    min: 1,
                    max: MBToBytes(5),
                }),

            body(`${field}.type`)
                .if(body(field).exists(nullable(notNullable)))
                .exists()
                .isString()
                .isMimeType(),

            body(field)
                .optional(nullable(notNullable))
                .custom(async(file: Entities.File.Encoded) => {
                    const base64Data = file.base64.split(';base64,')[1];
                    const fileBuffer = Buffer.from(base64Data, 'base64');

                    if (fileBuffer.length !== file.size) return Promise.reject();

                    let typeResult: undefined | {
                        ext: string,
                        mime: string,
                    } = undefined;

                    typeResult = await fromBuffer(fileBuffer);

                    if (!typeResult && isSvg(fileBuffer)) {
                        typeResult = { mime: 'image/svg+xml', ext: 'svg' };
                    }

                    if (!typeResult) return Promise.reject();

                    if (file.type !== typeResult.mime) return Promise.reject();

                    const extensionRegexp = /\.[^.]+$/;
                    const match = file.name.match(extensionRegexp);
                    if (!match) return Promise.reject();

                    if (match[0] !== `.${typeResult.ext}`) return Promise.reject();

                    const modifiedName = file.name.replace(extensionRegexp, '').replaceAll(' ', '');
                    if (modifiedName === '') return Promise.reject();

                    return Promise.resolve();
                }),
        ];
    },

    validEncodedImage(field: string) {
        return [
            ...chainPresets.validEncodedFile(field),

            body(`${field}.type`)
                .if(body(field).exists(nullable(false)))
                ._imageMime(),
        ];
    },
};