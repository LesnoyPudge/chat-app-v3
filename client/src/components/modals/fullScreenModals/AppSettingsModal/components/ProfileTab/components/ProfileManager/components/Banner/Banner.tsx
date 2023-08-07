import { Button,SpriteImage, OverlayContextProvider, OverlayItem, RelativelyPositioned, Tooltip, AnimatedTransition, Ref } from '@components';
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
                    <Ref<HTMLButtonElement>>
                        {(ref) => (
                            <>
                                <Button
                                    className={twClassNames(
                                        styles.bannerButton.base,
                                        { [styles.bannerButton.active]: isOverlayExist },
                                    )}
                                    isActive={isOverlayExist}
                                    label='Выбрать цвет баннера'
                                    hasPopup='dialog'
                                    innerRef={ref}
                                    onLeftClick={openOverlay}
                                >
                                    <SpriteImage
                                        className={styles.bannerIcon}
                                        name='DROPPER_ICON'
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
                                                    preferredAlignment='left'
                                                    spacing={10}
                                                    leaderElementOrRectRef={ref}
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

                                <Tooltip
                                    preferredAlignment='top'
                                    leaderElementRef={ref}
                                >
                                    <>Изменить цвет баннера</>
                                </Tooltip>
                            </>
                        )}
                    </Ref>
                )}
            </OverlayContextProvider>
        </div>
    );
};