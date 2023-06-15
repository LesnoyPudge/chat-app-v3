import { getEnv } from '@utils'; 
import { genSalt, hash } from 'bcrypt';



const { BCRYPT_SALT_ROUNDS } = getEnv();

export const hashPassword = async(password: string) => {
    const salt = await genSalt(parseInt(BCRYPT_SALT_ROUNDS));
    const hashedPassword = await hash(password, salt);

    return hashedPassword;
};