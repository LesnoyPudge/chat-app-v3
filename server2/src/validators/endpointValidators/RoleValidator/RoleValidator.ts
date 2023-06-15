import { Endpoints, Prettify } from '@shared';
import { chainPresets } from 'src/validators/chainPresets';
import { createValidator } from 'src/validators/createValidator';
import { customChains } from 'src/validators/customChains';
import { extendedValidator } from 'src/validators/extendedValidator';



type RoleEndpointsSchema = {
    [Endpoints.V1.Role.AddMember.ActionName]: Prettify<
        Endpoints.V1.Role.AddMember.RequestBody
    >,
    [Endpoints.V1.Role.Create.ActionName]: Prettify<
        Endpoints.V1.Role.Create.RequestBody
    >,
    [Endpoints.V1.Role.Delete.ActionName]: Prettify<
        Endpoints.V1.Role.Delete.RequestBody
    >,
    [Endpoints.V1.Role.GetOne.ActionName]: Prettify<
        Endpoints.V1.Role.GetOne.RequestBody
    >,
    [Endpoints.V1.Role.RemoveMember.ActionName]: Prettify<
        Endpoints.V1.Role.RemoveMember.RequestBody
    >,
    [Endpoints.V1.Role.Update.ActionName]: Prettify<
        Endpoints.V1.Role.Update.RequestBody
    >,
}

const { body } = extendedValidator;

export const RoleValidator = createValidator<RoleEndpointsSchema>({
    addMember: (req) => ({
        channelId: (
            body('channelId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.oneOf([
                    customChains.channelOwner(
                        req.auth.id,
                        req.body.channelId,
                    ),
                    customChains.permissionAdministrator(
                        req.auth.id,
                        req.body.channelId,
                    ),
                ]))
        ),
        roleId: (
            body('roleId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.roleExists(
                    req.body.roleId,
                    req.body.channelId,
                ))
        ),
        targetId: (
            body('targetId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.channelMember(
                    req.body.targetId,
                    req.body.channelId,
                ))
        ),
    }),

    create: (req) => ({
        channelId: (
            body('channelId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.oneOf([
                    customChains.channelOwner(
                        req.auth.id,
                        req.body.channelId,
                    ),
                    customChains.permissionAdministrator(
                        req.auth.id,
                        req.body.channelId,
                    ),
                ]))
        ),
        name: (
            body('name')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
        ),
    }),

    delete: (req) => ({
        channelId: (
            body('channelId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.oneOf([
                    customChains.channelOwner(
                        req.auth.id,
                        req.body.channelId,
                    ),
                    customChains.permissionAdministrator(
                        req.auth.id,
                        req.body.channelId,
                    ),
                ]))
        ),
        roleId: (
            body('roleId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.roleExists(
                    req.body.roleId,
                    req.body.channelId,
                ))
        ),
    }),

    getOne: (req) => ({
        channelId: (
            body('channelId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.channelMember(
                    req.auth.id,
                    req.body.channelId,
                ))
        ),
        roleId: (
            body('roleId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.roleExists(
                    req.body.roleId,
                    req.body.channelId,
                ))
        ),
    }),

    removeMember: (req) => ({
        channelId: (
            body('channelId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .if(customChains.not(
                    customChains.channelOwner(
                        req.auth.id,
                        req.body.channelId,
                    ),
                ))
                .not()
                .custom(customChains.channelOwner(
                    req.body.targetId,
                    req.body.channelId,
                ))
                .custom(customChains.permissionAdministrator(
                    req.auth.id,
                    req.body.channelId,
                ))
        ),
        roleId: (
            body('roleId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.roleExists(
                    req.body.roleId,
                    req.body.channelId,
                ))
        ),
        targetId: (
            body('targetId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.roleMember(
                    req.auth.id,
                    req.body.roleId,
                ))
        ),
    }),

    update: (req) => ({
        channelId: (
            body('channelId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.oneOf([
                    customChains.channelOwner(
                        req.auth.id,
                        req.body.channelId,
                    ),
                    customChains.permissionAdministrator(
                        req.auth.id,
                        req.body.channelId,
                    ),
                ]))
        ),
        roleId: (
            body('roleId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.roleExists(
                    req.body.roleId,
                    req.body.channelId,
                ))
        ),
        color: (
            body('color')
                .optional()
                .isString()
                ._sanitize()
                .notEmpty()
                .isHexColor()
        ),
        image: chainPresets.validEncodedImage('image'),
        isDefault: (
            body('isDefault')
                .optional()
                .isBoolean({ strict: true })
        ),
        name: (
            body('name')
                .optional()
                .isString()
                ._sanitize()
                .notEmpty()
        ),

        permissions: [
            body('permission')
                .optional()
                .isObject({ strict: true }),

            body('permission.*')
                .if(body('').exists({ values: 'null' }))
                .exists()
                .isBoolean({ strict: true }),
        ],
    }),
});