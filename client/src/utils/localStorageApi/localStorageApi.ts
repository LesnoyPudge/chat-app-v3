import { RTETypes } from '@components';
import { Id, Timestamp } from '@shared';



type ChannelId = Id;
type RoomId = Id;
type ChatId = Id;

type Values = {
    lastRefresh: Timestamp;
    myId: string;
    lastVisitedTextRooms: Record<ChannelId, RoomId>;
    savedMessageDrafts: Record<ChatId, RTETypes.Nodes>;
}

const myKeys: Array<keyof Values> = [
    'lastRefresh',
    'lastVisitedTextRooms',
    'myId',
    'savedMessageDrafts',
];

export const localStorageApi = {
    get: <T extends keyof Values>(key: T): Values[T] | null => {
        const value = localStorage.getItem(key);
        if (typeof value !== 'string') return null;

        try {
            const parsed = JSON.parse(value) as Values[T];
            return parsed;
        } catch (e) {
            localStorage.removeItem(key);
            return null;
            // return value as unknown as Values[T];
        }
    },

    set: <Key extends keyof Values, Value extends Values[Key]>(key: Key, value: Value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },

    remove: (key: keyof Values) => {
        localStorage.removeItem(key);
    },

    clear: () => {
        // localStorage.clear();

        myKeys.forEach((key) => localStorage.removeItem(key));
    },

    removeSensitive: () => {
        localStorageApi.remove('lastRefresh');
        localStorageApi.remove('myId');
        localStorageApi.remove('lastVisitedTextRooms');
        localStorageApi.remove('savedMessageDrafts');
    },
};