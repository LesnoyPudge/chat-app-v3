


interface ILocalStorageValues {
    token?: string;
    some?: string;
}

type UpdatableKeysType = 
    'token' |
    'some'
;

const get = (key: string) => {
    const value = localStorage.getItem(key);
    try {
        if (!value) return undefined;
        return JSON.parse(value);
    } catch (error) {
        return value;
    }
};

export const getLocalStorage = () => {
    const values: ILocalStorageValues = {
        token: get('token'),
        some: get('some'),
    };

    const set = (key: UpdatableKeysType, value: unknown) => {
        localStorage.setItem(key, JSON.stringify(value));
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