import { IMAGES } from '@generated';
import { defaultAvatar } from '@shared';
import { getEnv, getReadImagePath } from '@utils';



type Return<T extends string | undefined | null> = (
    NonNullable<T> extends never ? (undefined | null) : string
);

const { CUSTOM_NODE_ENV } = getEnv();

export const getAvatarPath = <T extends string | undefined | null>(
    avatarId: T,
): Return<T> => {
    if (typeof avatarId !== 'string') return avatarId as Return<T>;

    if (CUSTOM_NODE_ENV === 'development') {
        if (avatarId.includes('http')) {
            console.warn('fake avatar found', avatarId);
            return avatarId as Return<T>;
        }
    }

    if (defaultAvatar.isAvatar(avatarId)) return IMAGES.COMMON[avatarId].PATH as Return<T>;

    return getReadImagePath(avatarId) as Return<T>;
};