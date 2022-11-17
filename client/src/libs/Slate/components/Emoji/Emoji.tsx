import { Conditional } from '@components';
import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { RenderElementAttributes } from '../../types';



// https://unicode.org/emoji/charts/full-emoji-list.html
export type EmojiCodeType = ':poop:' | ':smile:' | ':shit:' | ':thumbsup:' | ':thumbsdown:' | ':ok_hand:' | ':ok:';

type EmojiPropsType = {
    className?: string;
} & ({
    isSerialized: true;
    code: EmojiCodeType;
    children?: never;
    attributes?: never;
} | {
    isSerialized?: never;
    code: EmojiCodeType;
    children: ReactNode;
    attributes: RenderElementAttributes;
})

interface IEmojiItem {
    code: EmojiCodeType[]; 
    label: string;
    filename: string;
}

export const emojiCodeList: EmojiCodeType[] = [
    ':poop:', 
    ':shit:', 
    ':smile:',
    ':thumbsup:',
    ':thumbsdown:',
    ':ok_hand:',
    ':ok:',
];

export const emojiList: IEmojiItem[] = [
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

export const Emoji: FC<EmojiPropsType> = ({ 
    className = '',
    code,
    attributes,
    children,
}) => {
    const formatedCode = code.toLowerCase() as EmojiCodeType;
    const currentEmoji = emojiList.find(item => item.code.includes(formatedCode));

    return (
        <span
            className={twMerge(classNames('inline-block h-6 aspect-square mx-0.5', className))}
            contentEditable={false}
            {...attributes}
        >
            {children}
            
            <Conditional isRendered={!!currentEmoji}>
                <img
                    className='inline-block w-full h-auto'
                    contentEditable={false}
                    draggable={false}
                    src={`/src/assets/emoji/${currentEmoji!.filename}.svg`}
                    alt={currentEmoji!.label}
                />
            </Conditional>
        </span>
    );
};