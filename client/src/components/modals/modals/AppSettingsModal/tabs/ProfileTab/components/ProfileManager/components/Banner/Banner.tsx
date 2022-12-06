import { Button, Icon, OverlayContextProvider, OverlayItem, RelativelyPositioned, Tooltip, AnimatedTransition, RefContextProvider } from '@components';
import { animated, UseTransitionProps } from '@react-spring/web';
import { FC, useState } from 'react';
import { ColorPicker } from './components';



const styles = {
    banner: `flex justify-end items-start p-4 h-[100px] 
    w-full rounded-t-lg`,
    bannerButton: {
        base: `flex w-10 h-10 bg-primary-300 rounded-full 
        fill-icon-200 hover:fill-icon-100 focus-visible:fill-icon-100`,
        active: 'fill-icon-100',
    },
    bannerIcon: 'w-4 h-4 m-auto transition-none',
};

const colorPickerTransitionOptions: UseTransitionProps = {
    from: { opacity: 0, translateX: '-10px' },
    enter: { opacity: 1, translateX: '0px' },
    leave: { opacity: 0, translateX: '-10px' },
};

export const Banner: FC = () => {
    const [bannerColor, setBannerColor] = useState('#ffffff');

    return (
        <div className={styles.banner} style={{ backgroundColor: bannerColor }}>
            <OverlayContextProvider>
                {({ isOverlayExist, openOverlay }) => (
                    <RefContextProvider>
                        {({ targetRef }) => (
                            <>
                                <Button
                                    className={styles.bannerButton.base}
                                    activeClassName={styles.bannerButton.active}
                                    isActive={isOverlayExist}
                                    isntStyled
                                    onClick={openOverlay}
                                >
                                    <Icon
                                        className={styles.bannerIcon}
                                        iconId='dropper-icon'
                                    />
                                </Button>

                                <AnimatedTransition 
                                    isExist={isOverlayExist} 
                                    transitionOptions={colorPickerTransitionOptions}
                                >
                                    {({ style, isAnimatedExist }) => (
                                        <OverlayItem 
                                            isRendered={isAnimatedExist}
                                            closeOnClickOutside
                                            closeOnEscape
                                            focused
                                            blocking
                                        >
                                            <animated.div style={style}>
                                                <RelativelyPositioned 
                                                    preferredAligment='left'
                                                    spacing={10}
                                                    targetRefOrRect={targetRef}
                                                >
                                                    <ColorPicker
                                                        color={bannerColor}
                                                        onChange={setBannerColor}
                                                    />
                                                </RelativelyPositioned>
                                            </animated.div>
                                        </OverlayItem>
                                    )}
                                </AnimatedTransition>

                                <Tooltip preferredAligment='top'>
                                    <>Изменить цвет баннера</>
                                </Tooltip>
                            </>
                        )}
                    </RefContextProvider>
                )}
            </OverlayContextProvider>
        </div>
    );
};