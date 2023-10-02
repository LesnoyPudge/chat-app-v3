import { PropsWithClassName } from '@types';
import { FC, useMemo } from 'react';
import { Image } from '@components';
import { twClassNames } from '@utils';
import { IMAGES } from '@generated';
import { createRegExp, anyOf, caseInsensitive } from 'magic-regexp';



// https://unicode.org/emoji/charts/full-emoji-list.html
export type EmojiCode = ':poop:' | ':smile:' | ':shit:' | ':thumbsup:' | ':thumbsdown:' | ':ok_hand:' | ':ok:';

export interface EmojiItem {
    code: EmojiCode[];
    label: string;
    path: string;
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

export const emojiRegExp = new RegExp(emojiCodeList.map(code => code.replace(/[^a-zA-Z]/g, '\\$&')).join('|'));

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

const codeRegExp = createRegExp(anyOf(...emojiCodeList), [caseInsensitive]);

const textEmojiRegExp = createRegExp(anyOf(...emojiList.map((item) => item.label)));

export const getEmojiMatch = (text: string): {
    emoji: EmojiItem,
    match: RegExpExecArray,
} | null => {
    text = text.toLowerCase();

    const codeMatch = codeRegExp.exec(text);
    if (codeMatch) {
        const emoji = emojiList.find((item) => item.code.includes(codeMatch[0]));
        if (!emoji) return null;

        return {
            emoji,
            match: codeMatch,
        };
    }

    const textEmojiMatch = textEmojiRegExp.exec(text);
    if (textEmojiMatch) {
        const emoji = emojiList.find((item) => item.label === textEmojiMatch[0]);
        if (!emoji) return null;

        return {
            emoji,
            match: textEmojiMatch,
        };
    }

    return null;
};

export type Emoji = PropsWithClassName & {
    code: EmojiCode;
    emojiItem?: EmojiItem;
}

const styles = {
    base: 'inline-block w-6 h-6 shrink-0 object-contain',
};

export const Emoji: FC<Emoji> = ({
    className = '',
    code,
    emojiItem,
}) => {
    const emoji = useMemo(() => {
        return (
            emojiItem
                ? emojiItem
                : emojiList.find(item => item.code.includes(code)) || emojiList[0]
        );
    }, [code, emojiItem]);

    return (
        <Image
            className={twClassNames(styles.base, className)}
            src={emoji.path}
            alt={emoji.label}
            lazy
        />
    );
};