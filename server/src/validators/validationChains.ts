import { ChannelServiceHelpers, RoleServiceHelpers, UserServiceHelpers } from '@services';
import { date, password } from '@utils';
import { ValidationChain, check } from 'express-validator';




type ValidationChainCreator<ExtraFields = Record<string, unknown>> = (args: {
    fieldName: string, 
    errorMessage?: string, 
    plural?: boolean,
    extraFields?: ExtraFields,
}) => ValidationChain;

const { isPasswordsEquals } = password;
const { isExpired } = date;

export const sanitizeInput: ValidationChainCreator = ({ fieldName }) => {
    return check(fieldName).trim().escape();
};

export const notEmpty: ValidationChainCreator = ({
    fieldName, 
    errorMessage,
    plural = false,
}) => {
    if (!errorMessage) errorMessage = plural ? 'Одно или более значение не указано' : 'Значение не указано';
    return check(fieldName).notEmpty().bail().withMessage(errorMessage);
};

export const isArray: ValidationChainCreator = ({
    fieldName, 
    errorMessage = 'Значение должно быть не пустым массивом',
    plural = false,
}) => {
    if (!errorMessage) errorMessage = plural ? 'Один или более значение должно быть не пустым массивом' : 'Значение должно быть не пустым массивом';
    return check(fieldName).isArray({ min: 1 }).bail().withMessage(errorMessage);
};

export const isMongoId: ValidationChainCreator = ({
    fieldName, 
    errorMessage,
    plural = false,
}) => {
    if (!errorMessage) errorMessage = plural ? 'Один или более значение не является ID' : 'Значение не является ID';
    return check(fieldName).isMongoId().bail().withMessage(errorMessage);
};

export const isUsersExistsById: ValidationChainCreator = ({
    fieldName, 
    errorMessage = 'Один или более пользователь не найден',
}) => {
    return check(fieldName).custom(async(userIds: string[]) => {
        const users = await UserServiceHelpers.isUsersExists({ _id: { $in: userIds } });
        const uniqueIds = new Set(userIds);
        if (users.length < uniqueIds.size) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isUserExistById: ValidationChainCreator = ({
    fieldName, 
    errorMessage = 'Пользователь не найден',
}) => {
    return check(fieldName).custom(async(userId: string) => {
        const isExist = await UserServiceHelpers.isUserExist({ _id: userId });
        if (!isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isValidLogin: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Неверный логин или пароль',
}) => {
    return check(fieldName).custom(async(login: string) => {
        const isExist = await UserServiceHelpers.isUserExist({ login });
        if (!isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isValidPassword: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Неверный логин или пароль',
}) => {
    return check(fieldName).custom(async(password: string, { req }) => {
        const user = await UserServiceHelpers.getOne({ _id: req.auth.user.id });
        const isEqueals = await isPasswordsEquals({ password, hashedPassword: user.password });
        if (!isEqueals) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isLoginUnoccupied: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Указанный логин уже используется',
}) => {
    return check(fieldName).custom(async(login: string) => {
        const isExist = await UserServiceHelpers.isUserExist({ login });
        if (isExist) return Promise.reject('Логин уже используется');
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const toString: ValidationChainCreator = ({ fieldName }) => {
    return check(fieldName).custom((value) => {
        if (typeof value === 'string') return value;
        return String(value);
    });
};

export const isEmailUnoccupied: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Указанная почта уже используется',
}) => {
    return check(fieldName).custom(async(email: string) => {
        const isExist = await UserServiceHelpers.isUserExist({ email });
        if (isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const nullable: ValidationChainCreator = ({ fieldName }) => {
    return check(fieldName).if((value: unknown) => {
        const isExist = typeof value !== 'undefined';
        const isTruthy = !!value;

        if (!isExist || !isTruthy) return Promise.reject();
        return Promise.resolve();
    });
};

export const isEmail: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Почта введена некорректно',
}) => {
    return check(fieldName).toLowerCase().normalizeEmail().isEmail().bail().withMessage(errorMessage);
};

export const isInMyBlockList: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Указанный пользователь заблокирован',
}) => {
    return check(fieldName).custom(async(userId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isInMyBlockList = await UserServiceHelpers.isUserExist({ _id: myId, blockList: userId });
        if (isInMyBlockList) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isntInMyBlockList: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Указанный пользователь не заблокирован',
}) => {
    return check(fieldName).custom(async(userId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isInMyBlockList = await UserServiceHelpers.isUserExist({ _id: myId, blockList: userId });
        if (!isInMyBlockList) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isInMyFriendList: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Пользоватьль не находится в вашем списке друзей',
}) => {
    return check(fieldName).custom(async(userId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isFriend = await UserServiceHelpers.isUserExist({ _id: myId, friends: userId });
        if (!isFriend) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isntInMyFriendList: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Пользователь в вашем списке друзей',
}) => {
    return check(fieldName).custom(async(userId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isFriend = await UserServiceHelpers.isUserExist({ _id: myId, friends: userId });
        if (isFriend) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isInMyIncomingFriendRequests: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Пользователь не находится в входящих запросах в друзья',
}) => {
    return check(fieldName).custom(async(userId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const hasRequest = await UserServiceHelpers.isUserExist({ _id: myId, 'friendRequests.incoming.from': userId });
        if (!hasRequest) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isntInMyIncomingFriendRequests: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Пользователь находится в входящих запросах в друзья',
}) => {
    return check(fieldName).custom(async(userId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const hasRequest = await UserServiceHelpers.isUserExist({ _id: myId, 'friendRequests.incoming.from': userId });
        if (hasRequest) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isInMyOutgoingFriendRequests: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Пользователь не находится в ваших искодящих запросах в друзья',
}) => {
    return check(fieldName).custom(async(userId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const hasRequest = await UserServiceHelpers.isUserExist({ _id: myId, 'friendRequests.outgoing.to': userId });
        if (!hasRequest) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isntInMyOutgoingFriendRequests: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Пользователь находится в ваших искодящих запросах в друзья',
}) => {
    return check(fieldName).custom(async(userId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const hasRequest = await UserServiceHelpers.isUserExist({ _id: myId, 'friendRequests.outgoing.to': userId });
        if (hasRequest) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isntImInBlockList: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Вы заблокированы пользователем',
}) => {
    return check(fieldName).custom(async(userId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isBlocked = await UserServiceHelpers.isUserExist({ _id: userId, blockList: myId });
        if (isBlocked) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isUUID: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Значение не является UUID',
}) => {
    return check(fieldName).isUUID('4').bail().withMessage(errorMessage);
};

export const isBase64Url: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Значение не является base64url',
}) => {
    return check(fieldName).isBase64({ urlSafe: true }).bail().withMessage(errorMessage);
};

export const isntSameAsOldPassword: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Новый пароль должен отличаться от предыдушего',
}) => {
    return check(fieldName).custom(async(newPassword: string, { req }) => {
        const myId = req.auth.user.id as string;
        const user = await UserServiceHelpers.getOne({ _id: myId });
        const isSamePassword = await isPasswordsEquals({ password: newPassword, hashedPassword: user.password });
        
        if (isSamePassword) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isValidActivationCode: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Указан не верный код активации',
}) => {
    return check(fieldName).custom(async(activationCode: string) => {
        const isValidActivationCode = await UserServiceHelpers.isUserExist({ activationCode });
        if (!isValidActivationCode) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isMyAccountActivated: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Ваш аккаунт не активирован',
}) => {
    return check(fieldName).custom(async(_, { req }) => {
        const myId = req.auth.user.id as string;
        const isActivated = await UserServiceHelpers.isUserExist({ _id: myId, isActivated: true });
        if (!isActivated) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isValidExtraStatus: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Значение не является статусом',
}) => {
    return check(fieldName).custom(async(extraStatus: string) => {
        const extraStatuses = ['default', 'afk', 'dnd', 'invisible'];
        const isValidExtraStatus = extraStatuses.includes(extraStatus);

        if (!isValidExtraStatus) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isValidAccessCode: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Указан неверный код доступа',
}) => {
    return check(fieldName).custom(async(accessCode: string, { req }) => {
        const myId = req.auth.user.id as string;
        const user = await UserServiceHelpers.getOne({ _id: myId });
        const isSame = accessCode === user.accessCode.code;
        const isCodeExpired = isExpired(user.accessCode.expiryDate);

        if (!isSame || isCodeExpired) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isChannelIdentifierUnoccupied: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Указанный идентификатор уже используется',
}) => {
    return check(fieldName).custom(async(identifier: string) => {
        const isOccupied = await ChannelServiceHelpers.isChannelExist({ identifier });
        if (isOccupied) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isChannelExistById: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Канал не найден',
}) => {
    return check(fieldName).custom(async(channelId: string) => {
        const isExist = await ChannelServiceHelpers.isChannelExist({ _id: channelId });
        if (!isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isChannelsExistsById: ValidationChainCreator = ({
    fieldName, 
    errorMessage = 'Один или более канал не найден',
}) => {
    return check(fieldName).custom(async(channelIds: string[]) => {
        const channels = await ChannelServiceHelpers.isChannelsExists({ _id: { $in: channelIds } });
        const uniqueIds = new Set(channelIds);
        if (channels.length < uniqueIds.size) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isImChannelMember: ValidationChainCreator = ({
    fieldName, 
    errorMessage = 'Вы не являетесь участником канала',
}) => {
    return check(fieldName).custom(async(channelId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isMember = await ChannelServiceHelpers.isChannelExist({ _id: channelId, members: myId });
        if (!isMember) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isntImChannelMember: ValidationChainCreator = ({
    fieldName, 
    errorMessage = 'Вы являетесь участником канала',
}) => {
    return check(fieldName).custom(async(channelId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isMember = await ChannelServiceHelpers.isChannelExist({ _id: channelId, members: myId });
        if (isMember) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isImChannelsMember: ValidationChainCreator = ({
    fieldName, 
    errorMessage = 'Вы не являетесь участником одного или более канала',
}) => {
    return check(fieldName).custom(async(channelIds: string[], { req }) => {
        const myId = req.auth.user.id as string;
        const channels = await ChannelServiceHelpers.isChannelsExists({ _id: { $in: channelIds }, members: myId });
        const uniqueIds = new Set(channelIds);
        if (channels.length < uniqueIds.size) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isPermittedToChangeChannel: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Отсутствует разрешение на изменение информации о канале',
}) => {
    return check(fieldName).custom(async(channelId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isPermitted = await RoleServiceHelpers.isRoleExist({
            channel: channelId, 
            users: myId,
            'permissions.channelControl': true,
        });

        if (!isPermitted) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isPermittedToChangeRoom: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Отсутствует разрешение на изменение комнат',
}) => {
    return check(fieldName).custom(async(channelId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isPermitted = await RoleServiceHelpers.isRoleExist({
            channel: channelId, 
            users: myId,
            'permissions.roomControl': true,
        });

        if (!isPermitted) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isPermittedToCreateInvitaion: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Отсутствует разрешение на создание приглашений',
}) => {
    return check(fieldName).custom(async(channelId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isPermitted = await RoleServiceHelpers.isRoleExist({
            channel: channelId, 
            users: myId,
            'permissions.createInvitation': true,
        });

        if (!isPermitted) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isPermittedToKickMember: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Отсутствует разрешение на исключение участника канала',
}) => {
    return check(fieldName).custom(async(channelId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isPermitted = await RoleServiceHelpers.isRoleExist({
            channel: channelId, 
            users: myId,
            'permissions.kickMember': true,
        });

        if (!isPermitted) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isPermittedToBanMember: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Отсутствует разрешение на бан участника канала',
}) => {
    return check(fieldName).custom(async(channelId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isPermitted = await RoleServiceHelpers.isRoleExist({
            channel: channelId, 
            users: myId,
            'permissions.banMember': true,
        });

        if (!isPermitted) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isPermittedToSendMessage: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Отсутствует разрешение на отправку сообщений',
}) => {
    return check(fieldName).custom(async(channelId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isPermitted = await RoleServiceHelpers.isRoleExist({
            channel: channelId, 
            users: myId,
            'permissions.sendMessage': true,
        });

        if (!isPermitted) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isPermittedToDeleteMessage: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Отсутствует разрешение на удаление сообщений',
}) => {
    return check(fieldName).custom(async(channelId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isPermitted = await RoleServiceHelpers.isRoleExist({
            channel: channelId, 
            users: myId,
            'permissions.deleteMessage': true,
        });

        if (!isPermitted) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isImChannelAdministrator: ValidationChainCreator = ({ fieldName }) => {
    return check(fieldName).if(async(channelId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isPermitted = await RoleServiceHelpers.isRoleExist({
            channel: channelId, 
            users: myId,
            'permissions.isAdministrator': true,
        });

        if (isPermitted) return Promise.reject();
        return Promise.resolve();
    });
};

export const isImChannelOwner: ValidationChainCreator = ({ fieldName }) => {
    return check(fieldName).if(async(channelId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const isOwner = await ChannelServiceHelpers.isChannelExist({
            _id: channelId,
            owner: myId,
        });

        if (isOwner) return Promise.reject();
        return Promise.resolve();
    });
};

export const reject: ValidationChainCreator = ({
    fieldName,
    errorMessage = '',
}) => {
    return check(fieldName).custom(async() => {
        return Promise.reject();
    }).bail().withMessage(errorMessage);
};

export const isUserChannelMember: ValidationChainCreator<{channelIdPath: string}> = ({
    fieldName, 
    errorMessage = 'Пользователь не учатсник канала',
    extraFields,
}) => {
    return check(fieldName).custom(async(userId: string, { req }) => {
        const channelId = req[extraFields.channelIdPath] as string;
        const isMember = await ChannelServiceHelpers.isChannelExist({ _id: channelId, members: userId });
        if (!isMember) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isntUserChannelOwner: ValidationChainCreator<{channelIdPath: string}> = ({
    fieldName, 
    errorMessage = 'Пользователь владелец канала',
    extraFields,
}) => {
    return check(fieldName).custom(async(userId: string, { req }) => {
        const channelId = req[extraFields.channelIdPath] as string;
        const isOwner = await ChannelServiceHelpers.isChannelExist({ _id: channelId, owner: userId });
        if (isOwner) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isUserInChannelBanList: ValidationChainCreator<{channelIdPath: string}> = ({
    fieldName, 
    errorMessage = 'Пользователь не забанен',
    extraFields,
}) => {
    return check(fieldName).custom(async(userId: string, { req }) => {
        const channelId = req[extraFields.channelIdPath] as string;
        const isBanned = await ChannelServiceHelpers.isChannelExist({ _id: channelId, 'banList.user': userId });
        if (!isBanned) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const toInt: ValidationChainCreator = ({
    fieldName, 
    errorMessage = 'Значение должно быть целым числом',
}) => {
    return check(fieldName).toInt().custom((value: unknown) => {
        return typeof value === 'number';
    }).bail().withMessage(errorMessage);
};

export const isValidInvitationCode: ValidationChainCreator<{channelIdPath: string}> = ({
    fieldName, 
    errorMessage = 'Указан неверный код приглашения',
    extraFields,
}) => {
    return check(fieldName).toInt().custom(async(code: string, { req }) => {
        const channelId = req[extraFields.channelIdPath] as string;
        const channel = await ChannelServiceHelpers.getOne({ _id: channelId });
        const invitation = channel.invitations.filter((invitation) => {
            invitation.code === code;
        })[0];
        
        if (!invitation) return Promise.reject();
        
        const isCodeExpired = isExpired(invitation.expiryDate);
        if (isCodeExpired) return Promise.reject();

        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isInvitationCodeUnoccupied: ValidationChainCreator<{channelIdPath: string}> = ({
    fieldName,
    errorMessage = 'Указанный код приглашения уже используется',
    extraFields,
}) => {
    return check(fieldName).custom(async(code: string, { req }) => {
        const channelId = req[extraFields.channelIdPath] as string;
        const isOccupied = await ChannelServiceHelpers.isChannelExist({ _id: channelId, 'invitations.code': code });
        if (isOccupied) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isImInvitationCreator: ValidationChainCreator<{invitationCodePath: string}> = ({
    fieldName,
    extraFields,
}) => {
    return check(fieldName).if(async(channelId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const code = req[extraFields.invitationCodePath] as string;
        const isCreator = await ChannelServiceHelpers.isChannelExist({ 
            _id: channelId, 
            'invitations.code': code, 
            'invitations.creator': myId, 
        });

        if (isCreator) return Promise.reject();
        return Promise.resolve();
    });
};

export const isRoleExistById: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Роль не найдена',
}) => {
    return check(fieldName).custom(async(roleId: string) => {
        const isExist = await RoleServiceHelpers.isRoleExist({ _id: roleId });
        if (!isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};