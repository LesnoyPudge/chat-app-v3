import { IMAGES } from '@generated';
import { Endpoints, defaultAvatar } from '@shared';
import { getEnv } from '@utils';



const { CUSTOM_NODE_ENV } = getEnv();

export const getAvatarPath = (avatarId: string): string => {
    if (CUSTOM_NODE_ENV === 'development') {
        if (!avatarId) {
            console.error('avatarId not provided', avatarId);
            return defaultAvatar.getRandomAvatar();
        }

        if (avatarId.includes('http')) {
            console.warn('fake avatar found', avatarId);
            return avatarId;
        }
    }

    if (defaultAvatar.isAvatar(avatarId)) return IMAGES.COMMON[avatarId].PATH;

    return `${Endpoints.V1.File.Read.Path}/${avatarId}`;
};