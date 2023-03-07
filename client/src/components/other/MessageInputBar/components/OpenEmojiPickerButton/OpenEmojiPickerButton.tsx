import { AnimatedTransition, Button, OverlayContextProvider, OverlayItem, RefContextProvider, RelativelyPositioned, EmojiPicker, EmojiSwitcher } from '@components';
import { useSlateAddEmoji } from '@libs';
import { animated } from '@react-spring/web';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';




const styles = {
    button: 'shrink-0 h-11 w-11',
    switcher: 'w-full h-full',
};
export const OpenEmojiPickerButton: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { addEmoji } = useSlateAddEmoji();

    return (
        <OverlayContextProvider>
            {({ openOverlay, isOverlayExist }) => (
                <RefContextProvider>
                    {({ targetRef }) => (
                        <>
                            <EmojiSwitcher 
                                className={styles.switcher}
                                isActive={isOverlayExist}
                            >
                                {({ content, switchEmojiCode, wrapperClassName }) => {
                                    return (
                                        <Button
                                            className={twClassNames(wrapperClassName, styles.button, className)}
                                            label='Выбрать эмодзи'
                                            hasPopup='dialog'
                                            isActive={isOverlayExist}
                                            onMouseEnter={switchEmojiCode}
                                            onLeftClick={openOverlay}
                                        >
                                            {content}
                                        </Button>
                                    );
                                }}
                            </EmojiSwitcher>

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
                    )}
                </RefContextProvider>
            )}
        </OverlayContextProvider>
    );
};