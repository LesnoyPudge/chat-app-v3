import { isObject } from '@reExport';
import { ObjectWithId } from '@types';





export const isObjectWithId = (obj: unknown): obj is ObjectWithId => {
    if (!isObject(obj)) return false;
    return 'id' in obj;
};