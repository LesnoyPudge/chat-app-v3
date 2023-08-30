import { IMAGES } from '@generated';
import { defaultAvatar } from '@shared';
import { getReadImagePath } from '@utils';




export const getAvatarPath = (avatarId: string | undefined | null): string | null => {
    if (avatarId === undefined) return 'undefined';

    if (avatarId === null) return avatarId;

    if (avatarId.includes('http')) {
        console.warn('fake avatar found', avatarId);
        return avatarId;
    }

    if (defaultAvatar.isAvatar(avatarId)) return IMAGES.COMMON[avatarId].PATH;

    return getReadImagePath(avatarId);
};