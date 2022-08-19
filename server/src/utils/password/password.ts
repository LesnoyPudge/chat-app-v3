import * as bcrypt from 'bcrypt';
import { getEnv } from '../getEnv';



const { BCRYPT_SALT_ROUNDS } = getEnv();

export const password = {
    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(parseInt(BCRYPT_SALT_ROUNDS));
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    },

    async isPasswordsEquals({ password, hashedPassword }: {password: string, hashedPassword: string}) {
        const isEqual = await bcrypt.compare(password, hashedPassword);

        return isEqual;
    },
};