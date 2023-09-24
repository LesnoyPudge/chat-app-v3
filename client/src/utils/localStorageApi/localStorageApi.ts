import { Id, Timestamp } from '@shared';
import { Descendant } from 'slate';



type ChannelId = Id;
type RoomId = Id;
type ChatId = Id;

type Values = {
    lastRefresh: Timestamp;
    myId: string;
    lastVisitedTextRooms: Record<ChannelId, RoomId>;
    savedMessageDrafts: Record<ChatId, Descendant[]>;
}

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
        localStorage.clear();
    },

    removeSensitive: () => {
        localStorageApi.remove('lastRefresh');
        localStorageApi.remove('myId');
        localStorageApi.remove('lastVisitedTextRooms');
    },
};