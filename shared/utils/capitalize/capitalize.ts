


export const capitalize = <T extends string>(word: T): Capitalize<T> => {
    if (!word) return word as Capitalize<T>;
    return word.charAt(0).toUpperCase() + word.slice(1) as Capitalize<T>;
};