import { AnimatedTransition, Button, OverlayContextProvider, OverlayItem, RelativelyPositioned, EmojiPicker, EmojiSwitcher, Ref, RTEModules } from '@components';
import { animated } from '@react-spring/web';
import { PropsWithClassName } from '@types';
import { getTransitionOptions, twClassNames } from '@utils';
import { FC } from 'react';




const styles = {
    switcher: 'w-full h-full',
};

const transitionOptions = getTransitionOptions.withOpacity();

export const OpenEmojiPickerButton: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { insert } = RTEModules.Emoji.useInsertEmoji();


    return (
        <OverlayContextProvider>
            {({ openOverlay, isOverlayExist }) => (
                <Ref<HTMLButtonElement>>
                    {(ref) => (
                        <>
                            <EmojiSwitcher
                                className={styles.switcher}
                                isActive={isOverlayExist}
                            >
                                {({ emojiComponent, switchEmojiCode, wrapperClassName }) => {
                                    return (
                                        <Button
                                            className={twClassNames(wrapperClassName, className)}
                                            label='Выбрать эмодзи'
                                            hasPopup='dialog'
                                            innerRef={ref}
                                            isActive={isOverlayExist}
                                            onMouseEnter={switchEmojiCode}
                                            onLeftClick={openOverlay}
                                        >
                                            {emojiComponent}
                                        </Button>
                                    );
                                }}
                            </EmojiSwitcher>

                            <AnimatedTransition
                                isExist={isOverlayExist}
                                transitionOptions={transitionOptions}
                            >
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
                                                leaderElementOrRectRef={ref}
                                            >
                                                <EmojiPicker onEmojiPick={insert}/>
                                            </RelativelyPositioned>
                                        </animated.div>
                                    </OverlayItem>
                                )}
                            </AnimatedTransition>
                        </>
                    )}
                </Ref>
            )}
        </OverlayContextProvider>
    );
};