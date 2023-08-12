import isEqual from 'react-fast-compare';



export const getDiff = <Source extends object, New extends Partial<Source>>(
    sourceObject: Source,
    newObject: New,
): New => {
    const result = {} as New;
    for (const key in sourceObject) {
        if (!Object.hasOwn(sourceObject, key)) break;
        if (!Object.hasOwn(newObject, key)) break;

        if (!isEqual(sourceObject[key], newObject[key])) {
            result[key] = newObject[key];
        }
    }

    return result;
};