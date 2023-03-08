import { PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { getRandomNumber, twClassNames } from '@utils';
import { FC, ReactNode, useRef, useState } from 'react';
import { ChildrenAsNodeOrFunction, Emoji, uniqueEmojiCodeList } from '@components';



interface ChildrenArgs {
    emojiComponent: ReactNode;
    wrapperClassName: string;
    switchEmojiCode: () => void;
}

interface EmojiSwitcher extends PropsWithClassName, PropsWithChildrenAsNodeOrFunction<ChildrenArgs> {
    isActive?: boolean;
}

const styles = {
    emoji: {
        base: `w-full h-full grayscale transition-all duration-300
        group-focus-visible/emojiSwitcher:scale-[1.14] group-focus-visible/emojiSwitcher:grayscale-0
        group-hover/emojiSwitcher:scale-[1.14] group-hover/emojiSwitcher:grayscale-0`,
        active: 'scale-[1.14] grayscale-0',
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
    
    const switchEmojiCode = () => {
        if (!isActive) setCurrentEmojiCode(getRandomEmojiCode());
    };

    const emojiComponent = (
        <Emoji
            className={twClassNames(
                styles.emoji.base, 
                { [styles.emoji.active]: isActive },
                className,
            )}
            code={currentEmojiCode}
        />
    );

    const childrenArgs: ChildrenArgs = {
        emojiComponent,
        wrapperClassName: 'group/emojiSwitcher',
        switchEmojiCode,
    };

    return (
        <ChildrenAsNodeOrFunction args={childrenArgs}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};