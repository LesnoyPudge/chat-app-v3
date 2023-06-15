import { compare } from 'bcrypt';



export const isPasswordsEquals = (password: string, hashedPassword: string) => {
    return compare(password, hashedPassword);
};