import { PropsWithClassName } from '@types';
import { FC } from 'react';
import { Image } from '@components';
import { twClassNames } from '@utils';
import { IMAGES } from '@generated';



// https://unicode.org/emoji/charts/full-emoji-list.html
export type EmojiCode = ':poop:' | ':smile:' | ':shit:' | ':thumbsup:' | ':thumbsdown:' | ':ok_hand:' | ':ok:';

interface EmojiItem {
    code: EmojiCode[];
    label: string;
    path: string;
}

interface Emoji extends PropsWithClassName {
    code: EmojiCode;
}

export const emojiCodeList: EmojiCode[] = [
    ':poop:',
    ':shit:',
    ':smile:',
    ':thumbsup:',
    ':thumbsdown:',
    ':ok_hand:',
    ':ok:',
];

export const emojiCodeRegExp = new RegExp(emojiCodeList.map(code => code.replace(/[^a-zA-Z]/g, '\\$&')).join('|'));

export const emojiList: EmojiItem[] = [
    {
        code: [':smile:'],
        label: '😀',
        path: IMAGES.COMMON.SMILE.PATH,
    },
    {
        code: [':poop:', ':shit:'],
        label: '💩',
        path: IMAGES.COMMON.POOP.PATH,
    },
    {
        code: [':thumbsup:'],
        label: '👍',
        path: IMAGES.COMMON.THUMBSUP.PATH,
    },
    {
        code: [':thumbsdown:'],
        label: '👎',
        path: IMAGES.COMMON.THUMBSDOWN.PATH,
    },
    {
        code: [':ok_hand:', ':ok:'],
        label: '👌',
        path: IMAGES.COMMON.OK_HAND.PATH,
    },
];

export const uniqueEmojiCodeList = emojiList.map((item) => item.code[0]);

const styles = {
    base: 'inline-block w-6 h-6 shrink-0 object-contain',
};

export const Emoji: FC<Emoji> = ({
    className = '',
    code,
}) => {
    const emoji = emojiList.find(item => item.code.includes(code)) || emojiList[0];

    return (
        <Image
            className={twClassNames(styles.base, className)}
            src={emoji.path}
            alt={emoji.label}
            lazy
        />
    );
};