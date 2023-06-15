import { nanoid, customAlphabet } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';



export const getRandomString = {
    getOnlyLettersString(size = 12) {
        const originalStringSize = size * 10;
        const regExp = new RegExp(/[^a-zA-Z]+/g);
        const originalString = nanoid(originalStringSize).replace(regExp, '');
        
        return originalString.slice(0, size);
    },

    getUUID() {
        return uuidv4();
    },
};