import Cookies from 'js-cookie';



type KeysType = 
    'refreshToken'
;

interface Values {
    refreshToken?: string;
}

const get = (key: KeysType) => {
    const value = Cookies.get(key);
    if (!value) return undefined;
    return value;
};

export const getCookie = () => {
    const values: Values = {
        refreshToken: get('refreshToken'),
    };

    const set = (name: KeysType, value: unknown, options?: Cookies.CookieAttributes | undefined) => {
        return Cookies.set(name, JSON.stringify(value), options);
    };

    const removeOne = (name: KeysType, options?: Cookies.CookieAttributes | undefined) => {
        Cookies.remove(name, options);
    };

    const removeAll = () => {
        for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key)) {
                Cookies.remove(key);
            }
        }
    };

    return {
        values,
        set,
        removeOne,
        removeAll,
    };
};