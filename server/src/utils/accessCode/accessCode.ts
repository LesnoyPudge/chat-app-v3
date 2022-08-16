import { getEnv } from '@utils';
import ms from 'ms';
import nanoid from 'nanoid';



const { ACCESS_CODE_SIZE } = getEnv();

export const accessCode = {
    async create() {
        const randomString = nanoid(100).replace(new RegExp(/[^a-zA-Z]+/g), '');
        const code = randomString.toUpperCase().slice(0, parseInt(ACCESS_CODE_SIZE));
        const expiryDate = Date.now() + ms(getEnv().ACCESS_CODE_DURATION);

        return {
            code,
            expiryDate,
        };
    },

    isExpired(expiryDate: Date) {
        const currentDate = Date.now();
        const expiryDateInMs = expiryDate.getMilliseconds();
        const isExpired = expiryDateInMs > currentDate;

        return isExpired;
    },
};