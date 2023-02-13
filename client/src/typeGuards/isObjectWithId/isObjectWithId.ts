import { isObject } from '@reExport';



type ObjectWithId = {
    id: string | number;
    [x: string]: unknown;
}

export const isObjectWithId = (obj: unknown): obj is ObjectWithId => {
    if (!isObject(obj)) return false;
    return (obj as ObjectWithId).id !== undefined;
};