import { RootState } from '@redux/store';
import { StrictOmit } from 'ts-essentials';
import { Entities, defaultAvatar } from '@shared';



// type State = StrictOmit<RootState, 'api' | 'app'>;

// type Mock = {
//     [Key in keyof State]: State[Key];
// };

type Mock = {
    me: Entities.User.WithoutCredentials;
    users: (Entities.User.Preview | Entities.User.WithoutCredentials)[];
};

const getRId = () => String(Math.floor(Math.random() * 1000000));

// export const mock: Mock = {
//     me: {
//         id: getRId(),
//         avatarId: defaultAvatar.getRandomAvatar(),
//         blocked: [],
//         channels: [],
//         createdAt: Date.now(),
//         email: null,
//         extraStatus: 'default',
//         friendRequests: {
//             incoming: [],
//             outgoing: [],
//         },
//         friends: [],
//         isActivated: false,
//         isDeleted: false,
//         login: getRId(),
//         privateChannels: [],
//         settings: {
//             fontSize: 16,
//             messageGroupSpacing: 16,
//             theme: 'auto',
//         },
//         username: 'dummy user',
//         status: 'offline',
//     },

//     users: [
//         {
//             id: getRId(),

//         },
//     ],
// };

// mock.users.push(mock.me);