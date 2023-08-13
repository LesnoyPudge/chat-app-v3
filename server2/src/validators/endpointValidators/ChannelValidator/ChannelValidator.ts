import { Endpoints, Prettify } from '@shared';
import { chainPresets } from 'src/validators/chainPresets';
import { createValidator } from 'src/validators/createValidator';
import { customChains } from 'src/validators/customChains';
import { extendedValidator } from 'src/validators/extendedValidator';



type ChannelEndpointsSchema = {
    [Endpoints.V1.Channel.AcceptInvitation.ActionName]: Prettify<
        Endpoints.V1.Channel.AcceptInvitation.RequestBody
    >,
    [Endpoints.V1.Channel.Ban.ActionName]: Prettify<
        Endpoints.V1.Channel.Ban.RequestBody
    >,
    [Endpoints.V1.Channel.Create.ActionName]: Prettify<
        Endpoints.V1.Channel.Create.RequestBody
    >,
    [Endpoints.V1.Channel.CreateInvitation.ActionName]: Prettify<
        Endpoints.V1.Channel.CreateInvitation.RequestBody
    >,
    [Endpoints.V1.Channel.Delete.ActionName]: Prettify<
        Endpoints.V1.Channel.Delete.RequestBody
    >,
    [Endpoints.V1.Channel.DeleteInvitation.ActionName]: Prettify<
        Endpoints.V1.Channel.DeleteInvitation.RequestBody
    >,
    [Endpoints.V1.Channel.GetOne.ActionName]: Prettify<
        Endpoints.V1.Channel.GetOne.RequestBody
    >,
    [Endpoints.V1.Channel.Kick.ActionName]: Prettify<
        Endpoints.V1.Channel.Kick.RequestBody
    >,
    [Endpoints.V1.Channel.Leave.ActionName]: Prettify<
        Endpoints.V1.Channel.Leave.RequestBody
    >,
    [Endpoints.V1.Channel.Unban.ActionName]: Prettify<
        Endpoints.V1.Channel.Unban.RequestBody
    >,
    [Endpoints.V1.Channel.Update.ActionName]: Prettify<
        Endpoints.V1.Channel.Update.RequestBody
    >,
}

const { body } = extendedValidator;

export const ChannelValidator = createValidator<ChannelEndpointsSchema>({
    acceptInvitation: (req) => ({
        code: (
            body('code')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.validInvitationCode(
                    req.auth.id,
                    req.body.code,
                ))
        ),
    }),

    ban: (req) => ({
        reason: (
            body('reason')
                .optional({ values: 'null' })
                .isString()
                ._sanitize()
                .notEmpty()
        ),
        targetId: (
            body('targetId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
        ),

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
                .custom(customChains.channelMember(
                    req.body.targetId,
                    req.body.channelId,
                ))
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
                .custom(customChains.all([
                    customChains.not(
                        customChains.permissionAdministrator(
                            req.body.targetId,
                            req.body.channelId,
                        ),
                    ),
                    customChains.oneOf([
                        customChains.permissionAdministrator(
                            req.auth.id,
                            req.body.channelId,
                        ),
                        customChains.permissionBan(
                            req.auth.id,
                            req.body.channelId,
                        ),
                    ]),
                ]))
        ),
    }),

    create: () => ({
        avatar: chainPresets.validEncodedImage('avatar'),
        identifier: (
            body('identifier')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._validIdentifier()
        ),
        name: (
            body('name')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
        ),
    }),

    createInvitation: (req) => ({
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
                .custom(customChains.oneOf([
                    customChains.channelOwner(
                        req.auth.id,
                        req.body.channelId,
                    ),
                    customChains.permissionAdministrator(
                        req.auth.id,
                        req.body.channelId,
                    ),
                    customChains.permissionCreateInvitation(
                        req.auth.id,
                        req.body.channelId,
                    ),
                ]))
        ),
        expiresAt: (
            body('expiresAt')
                .optional({ values: 'null' })
                .isInt({ min: Date.now() })
        ),
    }),

    delete: (req) => ({
        channelId: (
            body('channelId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.channelOwner(
                    req.auth.id,
                    req.body.channelId,
                ))
        ),
    }),

    deleteInvitation: (req) => ({
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
                    customChains.permissionCreateInvitation(
                        req.auth.id,
                        req.body.channelId,
                    ),
                ]))
        ),
        code: (
            body('code')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.invitationExists(
                    req.body.code,
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
    }),

    kick: (req) => ({
        targetId: (
            body('targetId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
        ),

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
                .custom(customChains.channelMember(
                    req.body.targetId,
                    req.body.channelId,
                ))
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
                .custom(customChains.all([
                    customChains.oneOf([
                        customChains.permissionAdministrator(
                            req.auth.id,
                            req.body.channelId,
                        ),
                        customChains.permissionKick(
                            req.auth.id,
                            req.body.channelId,
                        ),
                    ]),
                    customChains.not(
                        customChains.permissionAdministrator(
                            req.body.targetId,
                            req.body.channelId,
                        ),
                    ),
                ]))
        ),
    }),

    leave: (req) => ({
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
    }),

    unban: (req) => ({
        targetId: (
            body('targetId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
        ),

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
                .custom(customChains.inBanList(
                    req.body.targetId,
                    req.body.channelId,
                ))
                .if(customChains.not(
                    customChains.channelOwner(
                        req.auth.id,
                        req.body.channelId,
                    ),
                ))
                .if(customChains.not(
                    customChains.permissionAdministrator(
                        req.auth.id,
                        req.body.channelId,
                    ),
                ))
                .custom(customChains.permissionBan(
                    req.auth.id,
                    req.body.channelId,
                ))
        ),
    }),

    update: (req) => ({
        avatar: chainPresets.validEncodedImage('avatar'),

        name: (
            body('name')
                .optional()
                .isString()
                ._sanitize()
                .notEmpty()
        ),

        channelId: (
            body('channelId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.channelMember(
                    req.auth.id,
                    req.body.channelId))

                .if(customChains.not(
                    customChains.channelOwner(
                        req.auth.id,
                        req.body.channelId,
                    ),
                ))
                .if(customChains.not(
                    customChains.permissionAdministrator(
                        req.auth.id,
                        req.body.channelId,
                    ),
                ))
                .custom(customChains.permissionChannel(
                    req.auth.id,
                    req.body.channelId,
                ))
        ),
    }),
});