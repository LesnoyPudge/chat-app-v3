import { checkSchema } from 'express-validator';
import { singleFields } from '../singleFields';



export const UserValidator = {
    createUserValidator: () => {
        return checkSchema({
            email: singleFields.email,
            login: singleFields.login,
            username: singleFields.username,
            password: singleFields.password,
        });
    },
};