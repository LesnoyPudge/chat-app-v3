import { RefObject } from 'react';



export const isRef = (object: any): object is RefObject<any> => {
    return 'current' in object;
};