


interface LocalStorageValues {
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

    try {    
        const parsed = JSON.parse(value);
        
        if (typeof parsed === 'string') return parsed;

        return value;
    } catch (error) {
        return value;
    }
};

export const getLocalStorage = () => {
    const values: LocalStorageValues = {
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