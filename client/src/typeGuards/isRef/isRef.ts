import { isObject } from '@reExport';
import { RefObject } from 'react';



export const isRef = (object: unknown): object is RefObject<unknown> => {
    if (!isObject(object)) return false;
    return 'current' in object;
};