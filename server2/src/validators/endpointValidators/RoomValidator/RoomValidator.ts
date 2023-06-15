import { Endpoints, Prettify } from '@shared';
import { chainPresets } from 'src/validators/chainPresets';
import { createValidator } from 'src/validators/createValidator';
import { customChains } from 'src/validators/customChains';
import { extendedValidator } from 'src/validators/extendedValidator';



type RoomEndpointsSchema = {
    [Endpoints.V1.Room.Create.ActionName]: Prettify<
        Endpoints.V1.Room.Create.RequestBody
    >,
    [Endpoints.V1.Room.Delete.ActionName]: Prettify<
        Endpoints.V1.Room.Delete.RequestBody
    >,
    [Endpoints.V1.Room.GetOne.ActionName]: Prettify<
        Endpoints.V1.Room.GetOne.RequestBody
    >,
    [Endpoints.V1.Room.Update.ActionName]: Prettify<
        Endpoints.V1.Room.Update.RequestBody
    >,
}

const { body } = extendedValidator;

export const RoomValidator = createValidator<RoomEndpointsSchema>({
    create: (req) => ({
        channelId: (
            body('channelId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._channelExistById()
                .custom(customChains.channelMember(
                    req.auth.id,
                    req.body.channelId,
                ))
                .custom(customChains.oneOf([
                    customChains.channelOwner(
                        req.auth.id,
                        req.body.channelId,
                    ),
                    customChains.permissionAdministrator(
                        req.auth.id,
                        req.body.channelId,
                    ),
                    customChains.permissionRoom(
                        req.auth.id,
                        req.body.channelId,
                    ),
                ]))
        ),
        isPrivate: (
            body('isPrivate')
                .exists()
                .isBoolean({ strict: true })
        ),
        name: (
            body('name')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
        ),
        type: (
            body('type')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .isIn(['voice', 'text'])
        ),
        whiteList: [
            body('whiteList')
                .exists()
                .isObject({ strict: true }),

            body('whiteList.users')
                .exists()
                .isArray(),

            body('whiteList.users.*')
                .if(body('whiteList.users').isArray({ min: 1 }))
                .isString()
                ._sanitize()
                .notEmpty()
                ._userExistsById(),

            body('whiteList.roles')
                .exists()
                .isArray(),

            body('whiteList.roles.*')
                .if(body('whiteList.roles').isArray({ min: 1 }))
                .isString()
                ._sanitize()
                .notEmpty()
                ._roleExistById(),
        ],
    }),

    delete: (req) => ({
        channelId: (
            body('channelId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._channelExistById()
        ),
        roomId: (
            body('channelId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._roomExistById()
                .custom(customChains.channelMember(
                    req.auth.id,
                    req.body.channelId,
                ))
                .custom(customChains.oneOf([
                    customChains.channelOwner(
                        req.auth.id,
                        req.body.channelId,
                    ),
                    customChains.permissionAdministrator(
                        req.auth.id,
                        req.body.channelId,
                    ),
                    customChains.permissionRoom(
                        req.auth.id,
                        req.body.channelId,
                    ),
                ]))
        ),
    }),

    getOne: (req) => ({
        channelId: (
            body('channelId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._channelExistById()
        ),
        roomId: (
            body('roomId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._roomExistById()
                .custom(customChains.channelMember(
                    req.auth.id,
                    req.body.channelId,
                ))
                .if(customChains.not(
                    customChains.oneOf([
                        customChains.channelOwner(
                            req.auth.id,
                            req.body.channelId,
                        ),
                        customChains.permissionAdministrator(
                            req.auth.id,
                            req.body.channelId,
                        ),
                        customChains.permissionRoom(
                            req.auth.id,
                            req.body.channelId,
                        ),
                    ]),
                ))
                .if(customChains.privateRoom(req.body.roomId))
                .custom(customChains.inRoomWhiteList(
                    req.auth.id,
                    req.body.roomId,
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
                ._channelExistById()
                .custom(customChains.channelMember(
                    req.auth.id,
                    req.body.channelId,
                ))
                .custom(customChains.oneOf([
                    customChains.channelOwner(
                        req.auth.id,
                        req.body.channelId,
                    ),
                    customChains.permissionAdministrator(
                        req.auth.id,
                        req.body.channelId,
                    ),
                    customChains.permissionRoom(
                        req.auth.id,
                        req.body.channelId,
                    ),
                ]))
        ),
        roomId: (
            body('roomId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._roomExistById()
        ),
        isPrivate: (
            body('isPrivate')
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
        type: (
            body('type')
                .optional()
                .isString()
                ._sanitize()
                .notEmpty()
                .isIn(['voice', 'text'])
        ),
        whiteList: [
            body('whiteList')
                .optional()
                .isObject({ strict: true }),

            body('whiteList.users')
                .if(body('whiteList').exists())
                .exists()
                .isArray(),

            body('whiteList.users.*')
                .if(body('whiteList').exists())
                .if(body('whiteList.users').isArray({ min: 1 }))
                .isString()
                ._sanitize()
                .notEmpty()
                ._userExistsById(),

            body('whiteList.roles')
                .if(body('whiteList').exists())
                .exists()
                .isArray(),

            body('whiteList.roles.*')
                .if(body('whiteList').exists())
                .if(body('whiteList.roles').isArray({ min: 1 }))
                .isString()
                ._sanitize()
                .notEmpty()
                ._roleExistById(),
        ],
    }),
});