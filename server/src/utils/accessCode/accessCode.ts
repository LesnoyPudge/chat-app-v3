import { getEnv } from '@utils';
import ms from 'ms';
import nanoid from 'nanoid';



const { ACCESS_CODE_SIZE, ACCESS_CODE_ALPHABET } = getEnv();

export const accessCode = {
    async create() {
        const randomString = nanoid(100).replace(new RegExp(/[^a-zA-Z]+/g), '');
        const code = randomString.toUpperCase().slice(0, 6);
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