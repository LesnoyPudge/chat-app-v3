import Cookie from 'js-cookie';
import { Endpoints, Tokens, ValueOf } from '@shared';



const names: {[V in keyof Tokens]: V} = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
};

export const cookies = {
    get: (key: ValueOf<typeof names>) => {
        return Cookie.get(key);
    },

    clear: () => {
        Cookie.remove(names.accessToken);
        Cookie.remove(names.refreshToken, { path: Endpoints.V1.User.Refresh.Path });
    },
};