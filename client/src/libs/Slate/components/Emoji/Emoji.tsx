import classNames from 'classnames';
import { FC } from 'react';
import { RenderElementProps } from 'slate-react';
import { twMerge } from 'tailwind-merge';



// https://unicode.org/emoji/charts/full-emoji-list.html
export type EmojiCodeType = ':poop:' | ':smile:' | ':shit:';

interface IEmoji {
    className?: string;
    code: EmojiCodeType;
    props?: RenderElementProps;
}

interface IEmojiItem {
    code: EmojiCodeType[]; 
    label: string;
    filename: string;
}

const emojiList: IEmojiItem[] = [
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

export const Emoji: FC<IEmoji> = ({
    className = '',
    code,
    props,
}) => {
    const currentEmoji = emojiList.find(item => item.code.includes(code));

    if (!currentEmoji) return null;

    return (
        <span
            className={twMerge(classNames('inline-block', className))}
            contentEditable={false}
            // eslint-disable-next-line react/prop-types
            {...props?.attributes}
        >
            {props?.children}
            
            <img
                className='w-6 h-6 inline-block'
                contentEditable={false}
                draggable={false}
                src={`/src/assets/emoji/${currentEmoji.filename}.svg`}
                alt={currentEmoji.label}
            />
        </span>
    );
};