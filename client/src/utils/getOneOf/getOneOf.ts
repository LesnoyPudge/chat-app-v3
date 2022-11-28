import { getRandomNumber } from '@utils';



export const getOneOf = <T>(array: T[]) => {
    const max = Math.max(array.length - 1, 0);
    const randomIndex = getRandomNumber(0, max);
    return array[randomIndex];
};