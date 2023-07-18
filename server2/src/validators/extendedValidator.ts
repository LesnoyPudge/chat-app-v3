import { ChannelServiceHelpers, ChatServiceHelpers, FileServiceHelpers, MessageServiceHelpers, PrivateChannelServiceHelpers, RoleServiceHelpers, RoomServiceHelpers, UserServiceHelpers } from '@services';
import { CustomValidator, ExpressValidator } from 'express-validator';
import { writeFileSync } from 'fs';
import validator from 'validator';
import { objectKeys } from '../../../shared/utils';
import { customChains } from './customChains';
import isCallable from 'is-callable';
import { Prettify, StrictOmit } from '@shared';



type Validators = Record<string, (value: any) => Promise<void>>;

type Sanitizers = Record<string, (value: any) => any>;

const validators = {
    async _unoccupiedLogin(value: string) {
        const exists = await UserServiceHelpers.isUserExist({ login: value });

        if (!exists) return Promise.resolve();

        return Promise.reject('Указанный логин уже используется');
    },

    async _unoccupiedEmail(value: string) {
        const exists = await UserServiceHelpers.isUserExist({ email: value });

        if (!exists) return Promise.resolve();

        return Promise.reject('Указанный email уже используется');
    },

    async _correctLogin(value: string) {
        const exists = await UserServiceHelpers.isUserExist({ login: value });

        if (exists) return Promise.resolve();

        return Promise.reject('Неверный логин');
    },

    async _userExistsById(value: string) {
        const exists = await UserServiceHelpers.isUserExist({ id: value });

        if (exists) return Promise.resolve();

        return Promise.reject('Пользователь не найден');
    },

    async _privateChannelExistsById(value: string) {
        const exists = await PrivateChannelServiceHelpers.isExist({ id: value });

        if (exists) return Promise.resolve();

        return Promise.reject('Канал не найден');
    },

    async _fileExistsById(value: string) {
        const exists = await FileServiceHelpers.isExist({ id: value });

        if (exists) return Promise.resolve();

        return Promise.reject('Файл не найден');
    },

    async _validIdentifier(value: string) {
        const exists = await ChannelServiceHelpers.isExist({ invitations: value });

        if (!exists) return Promise.resolve();

        return Promise.reject('Идентификатор уже используется');
    },

    async _roomExistById(value: string) {
        const exists = await RoomServiceHelpers.isExist({ id: value });

        if (exists) return Promise.resolve();

        return Promise.reject('Комната не найдена');
    },

    async _channelExistById(value: string) {
        const exists = await ChannelServiceHelpers.isExist({ id: value });

        if (exists) return Promise.resolve();

        return Promise.reject('Канал не найдена');
    },

    async _imageMime(value: string) {
        if (value.includes('image')) return Promise.resolve();

        return Promise.reject();
    },

    async _roleExistById(value: string) {
        const exists = await RoleServiceHelpers.isExist({ id: value });

        if (exists) return Promise.resolve();

        return Promise.reject('Роль не найдена');
    },

    async _messageExistById(value: string) {
        const exists = await MessageServiceHelpers.isExist({ id: value });

        if (exists) return Promise.resolve();

        return Promise.reject('Сообщение не найдено');
    },

    async _chatExistById(value: string) {
        const exists = await ChatServiceHelpers.isExist({ id: value });

        if (exists) return Promise.resolve();

        return Promise.reject('Чат не найден');
    },
} satisfies Validators;

const sanitizers = {
    _sanitize(value: unknown) {
        return validator.escape(String(value)).trim();
    },
} satisfies Sanitizers;

export const extendedValidator = new ExpressValidator(validators, sanitizers);