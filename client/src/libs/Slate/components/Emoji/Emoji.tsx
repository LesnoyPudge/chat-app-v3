import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { RenderElementAttributes } from '../../types';



// https://unicode.org/emoji/charts/full-emoji-list.html
export type EmojiCodeType = ':poop:' | ':smile:' | ':shit:';

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
];

export const emojiList: IEmojiItem[] = [
    {
        code: [':smile:'],
        label: '',
        filename: 'smile',
    },
    {
        code: [':poop:', ':shit:'],
        label: '',
        filename: 'poop',
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
            
            {
                currentEmoji &&
                <img
                    className='inline-block w-full h-auto'
                    contentEditable={false}
                    draggable={false}
                    src={`/src/assets/emoji/${currentEmoji.filename}.svg`}
                    alt={currentEmoji.label}
                />
            }
        </span>
    );
};