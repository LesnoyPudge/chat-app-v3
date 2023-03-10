import { getInitialSlateValue } from '@libs';
import isObject from 'is-object';
import { Descendant } from 'slate';



const tryParseJSON = (json: string): unknown | undefined => {
    try {
        return JSON.parse(json);
    } catch (error) {
        return undefined;
    }
};

const isDescendantArray = (array: unknown): array is Descendant[] => {
    const notEmptyArray = Array.isArray(array) && !!array.length;

    if (!notEmptyArray) return false;

    const isDescendant = (obj: unknown): obj is Descendant => {
        if (!isObject(obj)) return false;
        return 'type' in obj && 'children' in obj;
    }; 

    return isDescendant(array[0]);
};

const fallbackValue = getInitialSlateValue();

export const parseSlateContent = (content: string) => {
    const parsedContent = tryParseJSON(content);
    
    if (!isDescendantArray(parsedContent)) return fallbackValue;

    return parsedContent;
};