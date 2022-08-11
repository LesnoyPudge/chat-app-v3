import { customAlphabet } from 'nanoid/async';
import { getEnv } from '@utils';
import ms from 'ms';



const { ACCESS_CODE_SIZE, ACCESS_CODE_ALPHABET } = getEnv();

export const accessCode = {
    async create() {
        const code = await customAlphabet(ACCESS_CODE_ALPHABET, ACCESS_CODE_SIZE)();
        const expiryDate = Date.now() + ms(getEnv().ACCESS_CODE_DURATION);

        return {
            code,
            expiryDate,
        };
    },

    isValid(expiryDate: Date) {
        const currentDate = Date.now();
        const expiryDateInMs = expiryDate.getMilliseconds();
        const isValid = expiryDateInMs > currentDate;

        return isValid;
    },
};