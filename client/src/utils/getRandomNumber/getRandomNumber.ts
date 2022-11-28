


export const getRandomNumber = (min: number, max: number) => {
    max = Math.floor(max);
    min = Math.ceil(min);
    
    return Math.floor(Math.random() * (max - min + 1) + min);
};