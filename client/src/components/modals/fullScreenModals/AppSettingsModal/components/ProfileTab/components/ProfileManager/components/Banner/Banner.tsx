import { Button, Icon, OverlayContextProvider, OverlayItem, RelativelyPositioned, Tooltip, AnimatedTransition, RefContextProvider } from '@components';
import { FormikColorPicker } from '@libs';
import { animated } from '@react-spring/web';
import { getTransitionOptions, twClassNames } from '@utils';
import { FC } from 'react';



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

const colorPickerTransitionOptions = getTransitionOptions.withOpacity({
    from: { translateX: '-10px' },
    enter: { translateX: '0px' },
    leave: { translateX: '-10px' },
});

export const Banner: FC = () => {
    const initialBannerColor = '#a90d0e';
    const colorPresets = [initialBannerColor, '#e3722c', '#5b0da9', '#0da9a9', '#5ba90d'];

    const bannerColor = '#fff';

    return (
        <div className={styles.banner} style={{ backgroundColor: bannerColor }}>
            <OverlayContextProvider>
                {({ isOverlayExist, openOverlay }) => (
                    <RefContextProvider>
                        {({ targetRef }) => (
                            <>
                                <Button
                                    className={twClassNames(
                                        styles.bannerButton.base,
                                        { [styles.bannerButton.active]: isOverlayExist },
                                    )}
                                    isActive={isOverlayExist}
                                    label='Выбрать цвет баннера'
                                    hasPopup='dialog'
                                    onLeftClick={openOverlay}
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
                                                    <div 
                                                        role='dialog' 
                                                        aria-label='Выберите цвет баннера'
                                                    >
                                                        <FormikColorPicker
                                                            name='bannerColor'
                                                            colorPresets={colorPresets}
                                                        />
                                                    </div>
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