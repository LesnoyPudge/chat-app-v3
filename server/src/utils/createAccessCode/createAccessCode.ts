import { getEnv, getRandomString, date } from '@utils';



export const createAccessCode = () => {
    const { ACCESS_CODE_SIZE, ACCESS_CODE_DURATION } = getEnv();
    const code = getRandomString.getOnlyLettersString(parseInt(ACCESS_CODE_SIZE)).toUpperCase();
    const expiryDate = date.setExpiyDate(ACCESS_CODE_DURATION);

    return {
        code,
        expiryDate: new Date(expiryDate),
    };
};