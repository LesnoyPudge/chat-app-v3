import { ChannelServiceHelpers, FileServiceHelpers, MessageServiceHelpers, PrivateChannelServiceHelpers, RoleServiceHelpers, RoomServiceHelpers, UserServiceHelpers } from '@services';
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
        const isEquals = await isPasswordsEquals({ password, hashedPassword: user.password });
        if (!isEquals) return Promise.reject();
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

export const isPermittedToSendMessageByChatId: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Отсутствует разрешение на отправку сообщений',
}) => {
    return check(fieldName).custom(async(chatId: string, { req }) => {
        const myId = req.auth.user.id as string;
        const room = await RoomServiceHelpers.getOne({ chat: chatId });
        const channel = await ChannelServiceHelpers.getOne({ rooms: room._id });

        const isPermitted = await RoleServiceHelpers.isRoleExist({
            channel: channel._id, 
            users: myId,
            'permissions.sendMessage': true,
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

export const isRoleColor: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Указанное значение не является одним из доступных цветов',
}) => {
    return check(fieldName).custom(async(color: string) => {
        const validColors = [''];
        const isValid = validColors.includes(color);
        if (!isValid) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isValidRoleOrder: ValidationChainCreator<{channelIdPath: string}> = ({
    fieldName,
    errorMessage = 'Указанное значение более или менее допустимого диапазона',
    extraFields,
}) => {
    return check(fieldName).custom(async(order: number, { req }) => {
        const channelId = req[extraFields.channelIdPath];
        const { roles } = await ChannelServiceHelpers.getOne({ _id: channelId });
        const isValid = 0 <= order && order < roles.length;

        if (!isValid) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isntRoleDefault: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Указанную роль нельзя удалить',
}) => {
    return check(fieldName).custom(async(roleId: number) => {
        const isDefault = await RoleServiceHelpers.isRoleExist({ _id: roleId, isDefault: true });
        if (isDefault) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const toBoolean: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Указанное значение должно быть одним из: true, false, 1, 0, yes, no',
}) => {
    return check(fieldName).custom((value: unknown) => {
        const booleans = ['true', 'false', '1', '0', 'yes', 'no'];
        return booleans.includes(value.toString().toLocaleLowerCase());
    }).customSanitizer((value: string | boolean) => {
        if (typeof value === 'string') return value;
        return String(value);
    }).bail().withMessage(errorMessage);
};

export const isRoleHasUser: ValidationChainCreator<{targetIdPath: string}> = ({
    fieldName,
    errorMessage = 'У пользователя нет указанной роли',
    extraFields,
}) => {
    return check(fieldName).custom(async(roleId: string, { req }) => {
        const targetId = req[extraFields.targetIdPath];
        const hasUser = await RoleServiceHelpers.isRoleExist({ _id: roleId, users: targetId });
        if (!hasUser) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isntRoleHasUser: ValidationChainCreator<{targetIdPath: string}> = ({
    fieldName,
    errorMessage = 'У пользователя есть указанная роль',
    extraFields,
}) => {
    return check(fieldName).custom(async(roleId: string, { req }) => {
        const targetId = req[extraFields.targetIdPath];
        const hasUser = await RoleServiceHelpers.isRoleExist({ _id: roleId, users: targetId });
        if (hasUser) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isFileExistById: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Указанного файла не существует',
}) => {
    return check(fieldName).custom(async(fileId: string) => {
        const isExist = await FileServiceHelpers.isFileExistById({ fileId });
        if (!isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isImChannelMemberByRoleId: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Вы не являетесь участником канала',
}) => {
    return check(fieldName).custom(async(roleId: string, { req }) => {
        const myId = req.auth.user.id;
        const role = await RoleServiceHelpers.getOne({ _id: roleId });
        const isExist = await ChannelServiceHelpers.isChannelExist({ _id: role.channel, members: myId });
        if (!isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isImChannelMemberByMessageId: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Вы не являетесь участником канала',
}) => {
    return check(fieldName).custom(async(messageId: string, { req }) => {
        const myId = req.auth.user.id;
        const message = await MessageServiceHelpers.getOne({ _id: messageId });
        const room = await RoomServiceHelpers.getOne({ chat: message.chat });
        const isExist = await ChannelServiceHelpers.isChannelExist({ _id: room.channel, members: myId });
        if (!isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isImHasAccessToRoomByMessageId: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Вы не имеете доступа к комнате',
}) => {
    return check(fieldName).custom(async(messageId: string, { req }) => {
        const myId = req.auth.user.id;
        const message = await MessageServiceHelpers.getOne({ _id: messageId });
        const room = await RoomServiceHelpers.getOne({ chat: message.chat });
        
        const rolesAccess = !!await RoleServiceHelpers.getMany({ 
            $in: { _id: { $in: room.whiteList.roles } },
            channel: room.channel,
            users: myId,
        });
        const usersAccess = room.whiteList.users.includes(myId); 
        const hasAccess = usersAccess || rolesAccess;

        if (!hasAccess) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isMessageExistById: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Указанного сообщения не существует',
}) => {
    return check(fieldName).custom(async(messageId: string) => {
        const isExist = await MessageServiceHelpers.isExist({ _id: messageId });
        if (!isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isMessageDeletedById: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Указанное сообщение не удалено',
}) => {
    return check(fieldName).custom(async(messageId: string) => {
        const isExist = await MessageServiceHelpers.isExist({ _id: messageId, isDeleted: true });
        if (!isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isntMessageDeletedById: ValidationChainCreator = ({
    fieldName,
    errorMessage = 'Указанное сообщение удалено',
}) => {
    return check(fieldName).custom(async(messageId: string) => {
        const isExist = await MessageServiceHelpers.isExist({ _id: messageId, isDeleted: false });
        if (!isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isPrivateChannelByChatId: ValidationChainCreator = ({ fieldName }) => {
    return check(fieldName).if(async(chatId: string) => {
        const isExist = await PrivateChannelServiceHelpers.isExist({ chat: chatId });
        if (isExist) return Promise.reject();
        return Promise.resolve();
    });
};

export const isImMessageOwner: ValidationChainCreator = ({ fieldName }) => {
    return check(fieldName).if(async(messageId: string, { req }) => {
        const myId = req.auth.user.id;
        const isExist = await MessageServiceHelpers.isExist({ _id: messageId, user: myId });
        if (isExist) return Promise.reject();
        return Promise.resolve();
    });
};

export const isRoomExistById: ValidationChainCreator = ({ 
    fieldName,
    errorMessage = 'Указанной комнаты не существует',
}) => {
    return check(fieldName).custom(async(roomId: string) => {
        const isExist = await RoomServiceHelpers.isExist({ _id: roomId });
        if (!isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isCategoryExist: ValidationChainCreator<{channelIdPath: string}> = ({ 
    fieldName,
    errorMessage = 'Указанной категории не существует',
    extraFields,
}) => {
    return check(fieldName).custom(async(categoryId: string, { req }) => {
        const channelId = req[extraFields.channelIdPath];
        const isExist = await ChannelServiceHelpers.isExist({ _id: channelId, categories: categoryId });
        if (!isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};


export const isPrivateChannelExist: ValidationChainCreator = ({ 
    fieldName,
    errorMessage = 'Приватный канал не существует',
}) => {
    return check(fieldName).custom(async(privateChannelId: string) => {
        const isExist = await PrivateChannelServiceHelpers.isExist({ _id:  privateChannelId });
        if (!isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isntPrivateChannelExistByTargetId: ValidationChainCreator = ({ 
    fieldName,
    errorMessage = 'Приватный канал существует',
}) => {
    return check(fieldName).custom(async(targetId: string, { req }) => {
        const myId = req.auth.user.id;
        const isExist = await PrivateChannelServiceHelpers.isExist({ $in: { members: [myId, targetId] } });
        if (isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};

export const isImPrivateChannelMember: ValidationChainCreator = ({ 
    fieldName,
    errorMessage = 'Вы не являетесь участником приватного канала',
}) => {
    return check(fieldName).custom(async(privateChannelId: string, { req }) => {
        const myId = req.auth.user.id;
        const isExist = await PrivateChannelServiceHelpers.isExist({ _id: privateChannelId, members: myId });
        if (isExist) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};