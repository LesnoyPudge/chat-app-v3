import { AnimatedTransition, Button, Emoji, OverlayContextProvider, OverlayItem, RefContextProvider, RelativelyPositioned, uniqueEmojiCodeList, EmojiPicker } from '@components';
import { useSlateAddEmoji } from '@libs';
import { animated } from '@react-spring/web';
import { PropsWithClassName } from '@types';
import { getOneOf, twClassNames } from '@utils';
import { FC, useState } from 'react';




const styles = {
    button: 'flex shrink-0 h-11 w-8 mx-1 group',
    emoji: {
        base: `m-auto w-6 transition-all grayscale group-hover:grayscale-0 group-hover:w-8
        group-focus-visible:grayscale-0 group-focus-visible:w-8`,
        active: 'grayscale-0 w-8',
    },
};

export const OpenEmojiPickerButton: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const [emojiCode, setEmojiCode] = useState(getOneOf(uniqueEmojiCodeList));
    const changeEmojiCode = () => setEmojiCode(getOneOf(uniqueEmojiCodeList));
    const { addEmoji } = useSlateAddEmoji();

    return (
        <OverlayContextProvider>
            {({ openOverlay, isOverlayExist }) => (
                <RefContextProvider>
                    {({ targetRef }) => {
                        const handleEmojiChange = () => !isOverlayExist && changeEmojiCode();

                        return (
                            <>
                                <Button
                                    className={twClassNames(styles.button, className, 'border-rose-600 border-2')}
                                    onLeftClick={openOverlay} 
                                    onMouseEnter={handleEmojiChange}
                                    onFocus={handleEmojiChange}
                                >
                                    <Emoji
                                        className={twClassNames(
                                            styles.emoji.base, 
                                            { [styles.emoji.active]: isOverlayExist },
                                        )}
                                        code={emojiCode}
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
                                                    preferredAlignment='top' 
                                                    targetRefOrRect={targetRef}
                                                >
                                                    <EmojiPicker onEmojiAdd={addEmoji}/>
                                                </RelativelyPositioned>
                                            </animated.div>
                                        </OverlayItem>
                                    )}
                                </AnimatedTransition>
                            </>
                        );
                    }}
                </RefContextProvider>
            )}
        </OverlayContextProvider>
    );
};