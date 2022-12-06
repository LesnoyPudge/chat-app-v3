import { AnimatedTransition, Button, OverlayContextProvider, OverlayItem, RefContextProvider, RelativelyPositioned } from '@components';
import { Emoji, uniqueEmojiCodeList } from '@libs';
import { animated } from '@react-spring/web';
import { PropsWithClassName } from '@types';
import { getOneOf, twClassNames } from '@utils';
import { FC, useState } from 'react';
import { EmojiPicker } from './components';




const styles = {
    button: 'group',
    emoji: {
        base: `m-auto transition-all grayscale group-hover:grayscale-0 group-hover:scale-[1.14]
        group-focus-visible:grayscale-0 group-focus-visible:scale-[1.14]`,
        active: 'grayscale-0 scale-[1.14]',
    },
};

export const OpenEmojiPickerButton: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const [emojiCode, setEmojiCode] = useState(getOneOf(uniqueEmojiCodeList));
    const changeEmojiCode = () => setEmojiCode(getOneOf(uniqueEmojiCodeList));

    return (
        <OverlayContextProvider>
            {({ openOverlay, isOverlayExist }) => (
                <RefContextProvider>
                    {({ targetRef }) => (
                        <>
                            <Button
                                className={twClassNames(styles.button, className)}
                                onClick={openOverlay} 
                                onMouseEnter={changeEmojiCode}
                            >
                                <Emoji
                                    className={twClassNames(
                                        styles.emoji.base, 
                                        { [styles.emoji.active]: isOverlayExist },
                                    )}
                                    code={emojiCode}
                                    isSerialized
                                />
                            </Button>
            
                            <AnimatedTransition isExist={isOverlayExist}>
                                {({ style, isAnimatedExist }) => (
                                    <OverlayItem 
                                        isRendered={isAnimatedExist}
                                        closeOnClickOutside
                                        closeOnEscape
                                        focused
                                    >
                                        <animated.div style={style}>
                                            <RelativelyPositioned 
                                                preferredAligment='top' 
                                                targetRefOrRect={targetRef}
                                            >
                                                <EmojiPicker/>
                                            </RelativelyPositioned>
                                        </animated.div>
                                    </OverlayItem>
                                )}
                            </AnimatedTransition>
                        </>
                    )}
                </RefContextProvider>
            )}
        </OverlayContextProvider>
    );
};