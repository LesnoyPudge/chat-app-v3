import classNames from 'classnames';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';



// https://unicode.org/emoji/charts/full-emoji-list.html
type EmojiCodeType = 'U+1F600' | 'U+1F603' | 'U+1F604' | 'U+1F44D' | 'U+1F44E';

interface IEmoji {
    className?: string;
    code: EmojiCodeType;
}

const emojiList: {code: EmojiCodeType, label: string}[] = [
    {
        code: 'U+1F600',
        label: 'grinning face',
    },
    {
        code: 'U+1F603',
        label: 'grinning face with big eyes',
    },
    {
        code: 'U+1F604',
        label: 'grinning face with smiling eyes',
    },
    {
        code: 'U+1F44D',
        label: 'thumbs up',
    },
    {
        code: 'U+1F44E',
        label: 'thumbs down',
    },
];

export const Emoji: FC<IEmoji> = ({
    className = '',
    code,
}) => {
    const label = emojiList.filter(item => item.code === code)[0].label;

    return (
        <span
            className={twMerge(classNames('emoji', { [className]: !!className }))}
            role='img'
            aria-label={label}
            aria-hidden={label ? 'false' : 'true'}
        >
            {code}
        </span>
    );
};