


export const objectKeys = <T extends object>(o: T) => {
    return Object.keys(o) as Array<keyof T>;
};