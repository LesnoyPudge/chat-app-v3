import { Entities, getRandomNumber, Override, Prettify } from "../../index";
import { urls } from "./urls";



type AvatarVariationNumber = 1 | 2 | 3 | 4;

const avatarNameStart = 'default-';

const avatarNames = Array(4).fill('').map((_, i) => `${avatarNameStart}${i + 1}`)

type Avatars = {
    [K in AvatarVariationNumber]: Prettify<Entities.File.Encoded & Override<
        Entities.File.Encoded,
        'type',
        'image/png'
    > & Override<
        Entities.File.Encoded,
        'name',
        `${typeof avatarNameStart}${K}`
    >>
};

// const avatars = Object.fromEntries(objectKeys(urls).map((key) => {
//     return [key, {
//         avatarName: `${avatarNameStart}${key}`,
//         info: {
//             name: `${avatarNameStart}${key}`,
//             type: 'image/png',
//             size: 1,
//             base64: urls[key],
//         },
//     }]
// })) as Avatars;

const avatars: Avatars = {
    "1": {
        name: `${avatarNameStart}1`,
        type: 'image/png',
        size: 1,
        base64: urls[1]
    },
    "2": {
        name: `${avatarNameStart}2`,
        type: 'image/png',
        size: 1,
        base64: urls[2]
    },
    "3": {
        name: `${avatarNameStart}3`,
        type: 'image/png',
        size: 1,
        base64: urls[3]
    },
    "4": {
        name: `${avatarNameStart}4`,
        type: 'image/png',
        size: 1,
        base64: urls[4]
    },
}

export const defaultAvatar = {
    isAvatar: (id: string): id is `${typeof avatarNameStart}${AvatarVariationNumber}` => {
        return avatarNames.includes(id);
    },
    
    getAvatar: (variation: AvatarVariationNumber) => {
        return avatars[variation]
    },
    
    getRandomAvatar: () => {
        return defaultAvatar.getAvatar(getRandomNumber(1, 4) as AvatarVariationNumber);
    }
}