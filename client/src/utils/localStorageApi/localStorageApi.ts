import { Timestamp } from '@shared';



type Values = {
    lastRefresh: Timestamp | null;
    accessToken: string | null;
}

export const localStorageApi = {
    get: <T extends keyof Values>(key: T): Values[T] => {
        const value = localStorage.getItem(key);
        if (typeof value !== 'string') return value;

        try {
            const parsed = JSON.parse(value) as Values[T];
            return parsed;
        } catch (e) {
            return value as unknown as Values[T];
        }
    },

    set: <Key extends keyof Values, Value extends Values[Key]>(key: Key, value: Value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },

    remove: (key: keyof Values) => {
        localStorage.removeItem(key);
    },

    clear: () => {
        localStorage.clear();
    },
};