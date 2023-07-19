import Cookie from 'js-cookie';
import { Endpoints, Tokens } from '@shared';



const names: {[V in keyof Tokens]: V} = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
};

export const cookies = {
    clear: () => {
        Cookie.remove(names.accessToken);
        Cookie.remove(names.refreshToken, { path: Endpoints.V1.User.Refresh.Path });
    },
};