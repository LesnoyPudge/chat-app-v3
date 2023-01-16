import { AnimatedTransition, OverlayItem, RelativelyPositioned, Button, OverlayContext, RefContext, Icon, RefContextProvider, AddFriendModal, LeaveChannelModal, DeleteChannelModal, InviteToChannelModal, OverlayContextProvider } from '@components';
import { animated } from '@react-spring/web';
import { getTransitionOptions } from '@utils';
import { FC, useContext } from 'react';



const transitionOptions = getTransitionOptions.withOpacity({
    from: {
        scale: 0.5,
    },
    enter: {
        scale: 1,
    },
    leave: {
        scale: 0.5,
    },
    config: {
        duration: 125,
    },
});

const styles = {
    wrapper: 'flex flex-col gap-1 w-[220px] bg-primary-500 py-1.5 px-2 rounded-md pointer-events-auto',
    button: `flex shrink-0 items-center justify-between gap-1 h-8 w-full text-start
    py-1.5 px-2 text-secondary rounded hover:bg-brand focus-visible:bg-brand
    hover:text-white focus-visible:text-white fill-icon-300 hover:fill-white focus-visible:fill-white`,
    buttonText: 'truncated font-medium text-sm',
    buttonIcon: 'h-5 w-5 transition-none',
};

export const ChannelMenu: FC = () => {
    const { isOverlayExist } = useContext(OverlayContext) as OverlayContext;
    const { targetRef } = useContext(RefContext) as RefContext;
    
    return (
        <AnimatedTransition 
            isExist={isOverlayExist}
            transitionOptions={transitionOptions}
        >
            {({ isAnimatedExist, style }) => (
                <OverlayItem
                    isRendered={isAnimatedExist}
                    blockable
                    blocking
                    focused
                    closeOnEscape
                    closeOnClickOutside
                >
                    <RelativelyPositioned
                        preferredAligment='bottom'
                        centered
                        targetRefOrRect={targetRef}
                        spacing={10}
                    >
                        <animated.div style={style}>
                            <div 
                                className={styles.wrapper} 
                                role='menu' 
                                aria-label='Меню канала'
                            >
                                <OverlayContextProvider>
                                    {({ openOverlay, isOverlayExist }) => (
                                        <>
                                            <Button 
                                                className={styles.button}
                                                role='menuitem'
                                                hasPopup='dialog'
                                                expanded={isOverlayExist}
                                                label='Пригласить друзей'
                                                onLeftClick={openOverlay}
                                            >
                                                <span className={styles.buttonText}>
                                                    <>Пригласить друзей</>
                                                </span>

                                                <Icon
                                                    className={styles.buttonIcon}
                                                    iconId='friend-icon'
                                                />
                                            </Button>

                                            <InviteToChannelModal/>
                                        </>
                                    )}
                                </OverlayContextProvider>

                                <OverlayContextProvider>
                                    {({ openOverlay, isOverlayExist }) => (
                                        <>
                                            <Button 
                                                className={styles.button}
                                                role='menuitem'
                                                hasPopup='dialog'
                                                expanded={isOverlayExist}
                                                label='Настройки канала'
                                                onLeftClick={openOverlay}
                                            >
                                                <span className={styles.buttonText}>
                                                    <>Настройки канала</>
                                                </span>

                                                <Icon
                                                    className={styles.buttonIcon}
                                                    iconId='settings-gear'
                                                />
                                            </Button>

                                            <AddFriendModal/>
                                        </>
                                    )}
                                </OverlayContextProvider>

                                <OverlayContextProvider>
                                    {({ openOverlay, isOverlayExist }) => (
                                        <>
                                            <Button 
                                                className={styles.button}
                                                role='menuitem'
                                                hasPopup='dialog'
                                                expanded={isOverlayExist}
                                                label='Покинуть канал'
                                                onLeftClick={openOverlay}
                                            >
                                                <span className={styles.buttonText}>
                                                    <>Покинуть канал</>
                                                </span>

                                                <Icon
                                                    className={styles.buttonIcon}
                                                    iconId='doorway-icon'
                                                />
                                            </Button>

                                            <LeaveChannelModal/>
                                        </>
                                    )}
                                </OverlayContextProvider>

                                <OverlayContextProvider>
                                    {({ openOverlay, isOverlayExist }) => (
                                        <>
                                            <Button 
                                                className={styles.button}
                                                role='menuitem'
                                                hasPopup='dialog'
                                                expanded={isOverlayExist}
                                                label='Удалить канал'
                                                onLeftClick={openOverlay}
                                            >
                                                <span className={styles.buttonText}>
                                                    <>Удалить канал</>
                                                </span>

                                                <Icon
                                                    className={styles.buttonIcon}
                                                    iconId='garbage-can-icon'
                                                />
                                            </Button>

                                            <DeleteChannelModal/>
                                        </>
                                    )}
                                </OverlayContextProvider>
                            </div>
                        </animated.div>
                    </RelativelyPositioned>
                </OverlayItem>
            )}
        </AnimatedTransition>
    );
};