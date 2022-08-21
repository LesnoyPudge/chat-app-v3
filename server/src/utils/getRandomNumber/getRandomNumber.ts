


export const getRandomNumber = ({ min, max }: {min: number, max: number | Array<unknown>}) => {
    if (typeof max === 'number') max = Math.floor(max);
    if (typeof max !== 'number') max = max.length - 1;

    min = Math.ceil(min);
    
    return Math.floor(Math.random() * (max - min + 1) + min);
};