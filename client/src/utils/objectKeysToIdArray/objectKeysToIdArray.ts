import { objectKeys } from '@utils';



export const objectKeysToIdArray = <T extends object>(obj: T) => {
    return objectKeys(obj).map((key) => ({ id: key }));
};