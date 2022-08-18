import nanoid from 'nanoid';



type GenerateStringType = (size?: number) => string;

export const generateString: GenerateStringType = (size = 12) => {
    const originalStringSize = size * 10;
    const regExp = new RegExp(/[^a-zA-Z]+/g);
    const originalString = nanoid(originalStringSize).replace(regExp, '');
    
    return originalString.slice(0, size);
};