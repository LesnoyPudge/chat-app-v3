import { IMAGES } from '@generated';
import { defaultAvatar } from '@shared';
import { getReadImagePath, isDev, logger } from '@utils';



type Return<T extends string | undefined | null> = (
    NonNullable<T> extends never ? (undefined | null) : string
);


export const getAvatarPath = <T extends string | undefined | null>(
    avatarId: T,
): Return<T> => {
    if (typeof avatarId !== 'string') return avatarId as Return<T>;

    if (isDev()) {
        if (avatarId.includes('http')) {
            // logger.log('fake avatar found', avatarId);
            return avatarId as Return<T>;
        }
    }

    if (defaultAvatar.isAvatar(avatarId)) {
        return IMAGES.COMMON[avatarId].PATH as Return<T>;
    }

    return getReadImagePath(avatarId) as Return<T>;
};