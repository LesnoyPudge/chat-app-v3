


interface ILocalStorageValues extends Record<string, any> {
    token?: string;
    some?: string;
}

type UpdatableKeysType = 
    'token' |
    'some'
;

const get = (key: string) => {
    const value = localStorage.getItem(key);
    if (!value) return undefined;
    return JSON.parse(value);
};

const isExist = (localStorage: Storage, storageValues: ILocalStorageValues, key: string) => {
    const isValidLocalStorageItem = Object.prototype.hasOwnProperty.call(localStorage, key);
    const isValidStorageItem = Object.prototype.hasOwnProperty.call(storageValues, key);
    const isExist = isValidLocalStorageItem && isValidStorageItem;

    return isExist;
};

export const getLocalStorage = () => {
    const values: ILocalStorageValues = {
        token: get('token'),
        some: get('some'),
    };

    const set = (key: UpdatableKeysType, newValue: any) => {
        if (!isExist(localStorage, values, key)) return;

        localStorage.setItem(key, JSON.stringify(newValue));
    };

    const clear = () => {
        localStorage.clear();
    };

    return {
        values,
        set,
        clear,
    };
};