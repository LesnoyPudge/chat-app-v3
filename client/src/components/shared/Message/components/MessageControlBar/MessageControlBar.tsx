import { animated } from '@react-spring/web';
import { FC, useContext } from 'react';
import { Tooltip, OverlayItem, AnimatedTransition, Button, EmojiPicker, Icon, OverlayContextProvider, RelativelyPositioned, Ref } from '@components';
import { PropsWithClassName } from '@types';
import { getTransitionOptions, twClassNames } from '@utils';
import { MessageContext } from '../../Message';



const styles = {
    buttonsWrapper: `flex absolute top-0 right-0 -translate-y-[25px] 
    mx-3.5 shadow-elevation-low rounded-md bg-primary-300 
    pointer-events-none opacity-0 group-hover:opacity-100 
    group-focus-within:opacity-100 group-hover:pointer-events-auto
    group-focus-within:pointer-events-auto`,
    button: `h-8 w-8 p-1.5 rounded-md fill-icon-200 
    hover:fill-icon-100 hover:bg-primary-hover
    focus-visible:fill-icon-100 focus-visible:bg-primary-hover`,
    buttonIcon: 'w-full h-full',
    tooltip: 'text-sm',
};

const transitionOptions = getTransitionOptions.withOpacity();

export const MessageControlBar: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { tabIndex, handleAddReaction, handleOpenEditor } = useContext(MessageContext) as MessageContext;

    return (
        <div
            className={twClassNames(styles.buttonsWrapper, className)}
            role='group'
            aria-label='Действия c сообщением'
        >
            <Ref<HTMLButtonElement>>
                {(ref) => (
                    <>
                        <OverlayContextProvider>
                            {({ isOverlayExist, openOverlay }) => (
                                <>
                                    <Button
                                        className={styles.button}
                                        label='Добавить реакцию'
                                        hasPopup='dialog'
                                        isActive={isOverlayExist}
                                        tabIndex={tabIndex}
                                        innerRef={ref}
                                        onLeftClick={openOverlay}
                                    >
                                        <Icon
                                            className={styles.buttonIcon}
                                            iconId='add-reaction-icon'
                                        />
                                    </Button>

                                    <Tooltip
                                        className={styles.tooltip}
                                        preferredAlignment='top'
                                        spacing={5}
                                        leaderElementRef={ref}
                                    >
                                        <>Добавить реакцию</>
                                    </Tooltip>

                                    <AnimatedTransition
                                        isExist={isOverlayExist}
                                        transitionOptions={transitionOptions}
                                    >
                                        {({ isAnimatedExist, style }) => (
                                            <OverlayItem
                                                isRendered={isAnimatedExist}
                                                blocking
                                                closeOnClickOutside
                                                closeOnEscape
                                                focused
                                            >
                                                <animated.div
                                                    style={style}
                                                    role='dialog'
                                                    aria-label='Выбор реакции'
                                                >
                                                    <RelativelyPositioned
                                                        preferredAlignment='top'
                                                        swappableAlignment
                                                        leaderElementOrRectRef={ref}
                                                    >
                                                        <EmojiPicker onEmojiAdd={handleAddReaction}/>
                                                    </RelativelyPositioned>
                                                </animated.div>
                                            </OverlayItem>
                                        )}
                                    </AnimatedTransition>
                                </>
                            )}
                        </OverlayContextProvider>
                    </>
                )}
            </Ref>

            <Ref<HTMLButtonElement>>
                {(ref) => (
                    <>
                        <Button
                            className={styles.button}
                            label='Редактировать сообщение'
                            tabIndex={tabIndex}
                            innerRef={ref}
                            onLeftClick={handleOpenEditor}
                        >
                            <Icon
                                className={styles.buttonIcon}
                                iconId='pen-icon'
                            />
                        </Button>

                        <Tooltip
                            className={styles.tooltip}
                            preferredAlignment='top'
                            spacing={5}
                            leaderElementRef={ref}
                        >
                            <>Редактировать сообщение</>
                        </Tooltip>
                    </>
                )}
            </Ref>

            <Ref<HTMLButtonElement>>
                {(ref) => (
                    <>
                        <Button
                            className={styles.button}
                            label='Показать больше опций'
                            hasPopup='dialog'
                            isActive={false}
                            tabIndex={tabIndex}
                            innerRef={ref}
                            onLeftClick={() => console.log('open right click message menu')}
                        >
                            <Icon
                                className={styles.buttonIcon}
                                iconId='more-icon'
                            />
                        </Button>

                        <Tooltip
                            className={styles.tooltip}
                            preferredAlignment='top'
                            spacing={5}
                            leaderElementRef={ref}
                        >
                            <>Ещё</>
                        </Tooltip>
                    </>
                )}
            </Ref>
        </div>
    );
};