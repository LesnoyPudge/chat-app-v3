import { Endpoints, Entities, Prettify } from '@shared';
import { chainPresets } from 'src/validators/chainPresets';
import { createValidator } from 'src/validators/createValidator';
import { customChains } from 'src/validators/customChains';
import { extendedValidator } from 'src/validators/extendedValidator';



type UserEndpointsSchema = {
    [Endpoints.V1.User.AcceptFriendRequest.ActionName]: Prettify<
        Endpoints.V1.User.AcceptFriendRequest.RequestBody
    >,
    [Endpoints.V1.User.Block.ActionName]: Prettify<
        Endpoints.V1.User.Block.RequestBody
    >,
    [Endpoints.V1.User.CredentialsUpdate.ActionName]: Prettify<
        Endpoints.V1.User.CredentialsUpdate.RequestBody
    >,
    [Endpoints.V1.User.DeclineFriendRequest.ActionName]: Prettify<
        Endpoints.V1.User.DeclineFriendRequest.RequestBody
    >,
    [Endpoints.V1.User.DeleteFriend.ActionName]: Prettify<
        Endpoints.V1.User.DeleteFriend.RequestBody
    >,
    [Endpoints.V1.User.GetOne.ActionName]: Prettify<
        Endpoints.V1.User.GetOne.RequestBody
    >,
    [Endpoints.V1.User.HidePrivateChannel.ActionName]: Prettify<
        Endpoints.V1.User.HidePrivateChannel.RequestBody
    >,
    [Endpoints.V1.User.Login.ActionName]: Prettify<
        Endpoints.V1.User.Login.RequestBody
    >,
    [Endpoints.V1.User.ProfileUpdate.ActionName]: Prettify<
        Endpoints.V1.User.ProfileUpdate.RequestBody
    >,
    [Endpoints.V1.User.Registration.ActionName]: Prettify<
        Endpoints.V1.User.Registration.RequestBody
    >,
    [Endpoints.V1.User.RevokeFriendRequest.ActionName]: Prettify<
        Endpoints.V1.User.RevokeFriendRequest.RequestBody
    >,
    [Endpoints.V1.User.SendFriendRequest.ActionName]: Prettify<
        Endpoints.V1.User.SendFriendRequest.RequestBody
    >,
    [Endpoints.V1.User.Unblock.ActionName]: Prettify<
        Endpoints.V1.User.Unblock.RequestBody
    >,
    [Endpoints.V1.User.VerifyAccessCode.ActionName]: Prettify<
        Endpoints.V1.User.VerifyAccessCode.RequestBody
    >,
}

const { body } = extendedValidator;

export const UserValidator = createValidator<UserEndpointsSchema>({
    registration: () => ({
        login: (
            body('login')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .withMessage('')
                ._unoccupiedLogin()
                .withMessage('Логин уже используется')
        ),
        password: (
            body('password')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
        ),
        username: (
            body('username')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
        ),
        email: (
            body('email')
                .optional()
                .isString()
                ._sanitize()
                .notEmpty()
                .isEmail()
                .withMessage('')
                ._unoccupiedEmail()
                .withMessage('Email уже используется')
        ),
    }),

    acceptFriendRequest: (req) => ({
        targetId: (
            body('targetId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.inIncomingFriendRequests(
                    req.auth.id,
                    req.body.targetId,
                ))
        ),
    }),

    block: (req) => ({
        targetId: (
            body('targetId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .not()
                .custom(customChains.inBlockList(
                    req.auth.id,
                    req.body.targetId,
                ))
        ),
    }),

    credentialsUpdate: (req) => ({
        accessCode: (
            body('accessCode')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.validAccessCode(
                    req.body.accessCode,
                    { id: req.auth.id },
                ))
        ),
        password: (
            body('password')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.correctPassword(
                    req.body.password,
                    { id: req.auth.id },
                ))
        ),
        newEmail: (
            body('newEmail')
                .optional()
                .isString()
                ._sanitize()
                .notEmpty()
        ),
        newLogin: (
            body('newLogin')
                .optional()
                .isString()
                ._sanitize()
                .notEmpty()
        ),
        newPassword: (
            body('newPassword')
                .optional()
                .isString()
                ._sanitize()
                .notEmpty()
        ),
    }),

    declineFriendRequest: (req) => ({
        targetId: (
            body('targetId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.inIncomingFriendRequests(
                    req.auth.id,
                    req.body.targetId,
                ))
        ),
    }),

    deleteFriend: (req) => ({
        targetId: (
            body('targetId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.inFriendList(
                    req.auth.id,
                    req.body.targetId,
                ))
        ),
    }),

    getOne: () => ({
        targetId: (
            body('targetId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._userExistsById()
        ),
    }),

    hidePrivateChannel: (req) => ({
        privateChannelId: (
            body('privateChannelId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._privateChannelExistsById()
                .custom(customChains.privateChannelMember(
                    req.auth.id,
                    req.body.privateChannelId,
                ))
        ),
    }),

    login: (req) => ({
        login: (
            body('login')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .withMessage('')
                ._correctLogin()
                .withMessage('Неверный логин или пароль')
        ),
        password: (
            body('password')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .withMessage('')
                .custom(customChains.correctPassword(
                    req.body.password,
                    { login: req.body.login },
                ))
                .withMessage('Неверный логин или пароль')
        ),
    }),

    profileUpdate: () => {
        const extraStatus = Object.keys({
            afk: null,
            default: null,
            dnd: null,
            invisible: null,
        } satisfies Record<Entities.User.ExtraStatus, null>);

        const theme = Object.keys({
            auto: null,
            dark: null,
            light: null,
        } satisfies Record<Entities.User.Default['settings']['theme'], null>);

        const fontSize = Object.keys({
            12: null,
            14: null,
            16: null,
            18: null,
            20: null,
        } satisfies Record<Entities.User.Default['settings']['fontSize'], null>);

        const messageGroupSpacing = Object.keys({
            16: null,
            20: null,
        } satisfies Record<Entities.User.Default['settings']['messageGroupSpacing'], null>);

        return {
            avatar: chainPresets.validEncodedImage('avatar'),
            extraStatus: (
                body('extraStatus')
                    .optional()
                    .isIn(extraStatus)
            ),
            settings: [
                body('settings.theme')
                    .if(body('settings').exists({ values: 'null' }))
                    .exists()
                    .isIn(theme),

                body('settings.fontSize')
                    .if(body('settings').exists({ values: 'null' }))
                    .exists()
                    .isIn(fontSize),

                body('settings.messageGroupSpacing')
                    .if(body('settings').exists({ values: 'null' }))
                    .exists()
                    .isIn(messageGroupSpacing),
            ],
            username: (
                body('username')
                    .optional()
                    .isString()
                    ._sanitize()
                    .notEmpty()
            ),
        };
    },

    revokeFriendRequest: (req) => ({
        targetId: (
            body('targetId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._userExistsById()
                .custom(customChains.inOutgoingFriendRequests(
                    req.auth.id,
                    req.body.targetId,
                ))
        ),
    }),

    sendFriendRequest: (req) => ({
        targetId: (
            body('targetId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._userExistsById()
                .not()
                .custom(customChains.inBlockList(
                    req.body.targetId,
                    req.auth.id,
                ))
                .not()
                .custom(customChains.inBlockList(
                    req.auth.id,
                    req.body.targetId,
                ))
                .not()
                .custom(customChains.inFriendList(
                    req.auth.id,
                    req.body.targetId,
                ))
                .not()
                .custom(customChains.inOutgoingFriendRequests(
                    req.auth.id,
                    req.body.targetId,
                ))
        ),
    }),

    unblock: (req) => ({
        targetId: (
            body('targetId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._userExistsById()
                .custom(customChains.inBlockList(
                    req.auth.id,
                    req.body.targetId,
                ))
        ),
    }),

    verifyAccessCode: () => ({
        accessCode: (
            body('accessCode')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
        ),
    }),
});