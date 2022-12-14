import { PropsWithClassName } from '@types';
import { FC } from 'react';
import { Image } from '@components';
import { twClassNames } from '@utils';



// https://unicode.org/emoji/charts/full-emoji-list.html
export type EmojiCode = ':poop:' | ':smile:' | ':shit:' | ':thumbsup:' | ':thumbsdown:' | ':ok_hand:' | ':ok:';

interface EmojiItem {
    code: EmojiCode[]; 
    label: string;
    filename: string;
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

export const emojiList: EmojiItem[] = [
    {
        code: [':smile:'],
        label: '😀',
        filename: 'smile',
    },
    {
        code: [':poop:', ':shit:'],
        label: '💩',
        filename: 'poop',
    },
    {
        code: [':thumbsup:'],
        label: '👍',
        filename: 'thumbsup',
    },
    {
        code: [':thumbsdown:'],
        label: '👎',
        filename: 'thumbsdown',
    },
    {
        code: [':ok_hand:', ':ok:'],
        label: '👌',
        filename: 'ok_hand',
    },
];

export const uniqueEmojiCodeList = emojiList.map((item) => item.code[0]);

const baseClassName = 'flex shrink-0 object-contain';

export const Emoji: FC<Emoji> = ({
    className = '',
    code,
}) => {
    const emoji = emojiList.find(item => item.code.includes(code));
    const src = `/src/assets/emoji/${emoji?.filename}.svg`;
    
    return (
        <Image
            className={twClassNames(baseClassName, className)}
            src={src}
            alt={emoji?.label}
        />
    );
};