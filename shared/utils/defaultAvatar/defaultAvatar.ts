import { getRandomNumber } from '../../index';



type AvatarIds = (
    'DEFAULT_AVATAR_1' |
    'DEFAULT_AVATAR_2' |
    'DEFAULT_AVATAR_3' |
    'DEFAULT_AVATAR_4'
);

const avatarArray = [
    'DEFAULT_AVATAR_1',
    'DEFAULT_AVATAR_2',
    'DEFAULT_AVATAR_3',
    'DEFAULT_AVATAR_4',
] satisfies AvatarIds[];

const avatarObject = {
    DEFAULT_AVATAR_1: 'DEFAULT_AVATAR_1',
    DEFAULT_AVATAR_2: 'DEFAULT_AVATAR_2',
    DEFAULT_AVATAR_3: 'DEFAULT_AVATAR_3',
    DEFAULT_AVATAR_4: 'DEFAULT_AVATAR_4',
} satisfies {
    [AvatarId in AvatarIds]: AvatarId;
};

export const defaultAvatar = {
    getRandomAvatar: () => {
        return avatarArray[getRandomNumber(1, 4)];
    },

    getAvatar: (id: AvatarIds) => {
        return avatarObject[id];
    },

    isAvatar: (id: string): id is AvatarIds => {
        return avatarArray.includes(id);
    },
};