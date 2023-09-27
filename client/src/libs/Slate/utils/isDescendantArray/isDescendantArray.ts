import { isObject } from '@reExport';
import { Descendant } from 'slate';



export const isDescendantArray = (array: unknown): array is Descendant[] => {
    const notEmptyArray = Array.isArray(array) && !!array.length;

    if (!notEmptyArray) return false;

    const isDescendant = (obj: unknown): obj is Descendant => {
        if (!isObject(obj)) return false;
        return 'type' in obj && 'children' in obj;
    };

    return isDescendant(array[0]);
};