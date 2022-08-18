import { getEnv, generateString } from '@utils';
import ms from 'ms';



const { ACCESS_CODE_SIZE } = getEnv();

export const createAccessCode = () => {
    const code = generateString(parseInt(ACCESS_CODE_SIZE)).toUpperCase();
    const expiryDate = Date.now() + ms(getEnv().ACCESS_CODE_DURATION);

    return {
        code,
        expiryDate: new Date(expiryDate),
    };
};