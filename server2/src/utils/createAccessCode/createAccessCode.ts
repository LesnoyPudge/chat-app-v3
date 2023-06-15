import { getEnv, getRandomString } from '@utils';
import ms from 'ms';
import { Entities } from '@shared';



const { ACCESS_CODE_SIZE, ACCESS_CODE_DURATION } = getEnv();

export const createAccessCode = (): Entities.User.Default['accessCode'] => {
    const code = getRandomString(parseInt(ACCESS_CODE_SIZE)).toUpperCase();
    const expiresAt = Date.now() + ms(ACCESS_CODE_DURATION);

    return {
        code,
        expiresAt,
    };
};