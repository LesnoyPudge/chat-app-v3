import { PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { getRandomNumber, twClassNames } from '@utils';
import { FC, ReactNode, useRef, useState } from 'react';
import { ChildrenAsNodeOrFunction, Emoji, uniqueEmojiCodeList } from '@components';



interface ChildrenArgs {
    content: ReactNode;
    wrapperClassName: string;
    switchEmojiCode: () => void;
}

interface EmojiSwitcher extends PropsWithClassName, PropsWithChildrenAsNodeOrFunction<ChildrenArgs> {
    isActive?: boolean;
}

const styles = {
    wrapper: 'w-10 h-10 p-1.5',
    emoji: {
        base: `w-full h-full scale-75 grayscale transition-all duration-300
        group-focus-visible/emojiSwitcher:scale-100 group-focus-visible/emojiSwitcher:grayscale-0
        group-hover/emojiSwitcher:scale-100 group-hover/emojiSwitcher:grayscale-0`,
        active: 'scale-100 grayscale-0',
    },
};

export const EmojiSwitcher: FC<EmojiSwitcher> = ({
    className = '',
    isActive = false,
    children,
}) => {
    const prevIndexRef = useRef<number | null>(null);

    const getRandomEmojiCode = () => {
        const rangeEnd = uniqueEmojiCodeList.length - 1;
        let index: number;

        index = getRandomNumber(0, rangeEnd);

        if (prevIndexRef.current !== null) {
            while (index === prevIndexRef.current) {
                index = getRandomNumber(0, rangeEnd);
            }
        }

        prevIndexRef.current = index;
    
        return uniqueEmojiCodeList[index];
    };

    const [currentEmojiCode, setCurrentEmojiCode] = useState(() => (getRandomEmojiCode()));
    
    const switchEmojiCode = () => setCurrentEmojiCode(getRandomEmojiCode());

    const content = (
        <div className={twClassNames(styles.wrapper, className)}>
            <Emoji
                className={twClassNames(styles.emoji.base, {
                    [styles.emoji.active]: isActive,
                })}
                code={currentEmojiCode}
            />
        </div>
    );

    const wrapperClassName = 'group/emojiSwitcher';

    const childrenArgs: ChildrenArgs = {
        content,
        wrapperClassName,
        switchEmojiCode,
    };

    return (
        <ChildrenAsNodeOrFunction args={childrenArgs}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};