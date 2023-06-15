import { customAlphabet } from 'nanoid';



export const getRandomString = (size = 12) => {
    return customAlphabet('abcdefghijklmnopqrstuvwxyz')(size);
};