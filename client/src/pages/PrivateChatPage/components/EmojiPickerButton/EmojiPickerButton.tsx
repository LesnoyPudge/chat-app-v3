import { Button } from '@components';
import { Emoji, uniqueEmojiCodeList } from '@libs';
import { getOneOf } from '@utils';
import classNames from 'classnames';
import { FC, useState } from 'react';
import { twMerge } from 'tailwind-merge';



const emojiBaseClassName = `m-auto transition-all grayscale group-hover:grayscale-0 group-hover:scale-[1.14]
group-focus-visible:grayscale-0 group-focus-visible:scale-[1.14]`;
const emojiActiveClassName = 'grayscale-0 scale-[1.14]';

export const EmojiPickerButton: FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [emojiCode, setEmojiCode] = useState(getOneOf(uniqueEmojiCodeList));

    const handleClick = () => setIsActive(prev => !prev);
    const changeEmojiCode = () => setEmojiCode(getOneOf(uniqueEmojiCodeList));

    return (
        <Button
            className='group'
            onClick={handleClick} 
            onMouseEnter={changeEmojiCode}
        >
            <Emoji
                className={twMerge(classNames(
                    emojiBaseClassName, 
                    { [emojiActiveClassName]: isActive },
                ))}
                code={emojiCode}
                isSerialized
            />
        </Button>
    );
};