import classNames from 'classnames';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';



interface IEmoji {
    className?: string;
    label?: string;
    symbol: string;
}

export const Emoji: FC<IEmoji> = ({
    className = '',
    label = '',
    symbol,
}) => {
    return (
        <span
            className={twMerge(classNames('emoji', { [className]: !!className }))}
            role='img'
            aria-label={label}
            aria-hidden={label ? 'false' : 'true'}
        >
            {symbol}
        </span>
    );
};