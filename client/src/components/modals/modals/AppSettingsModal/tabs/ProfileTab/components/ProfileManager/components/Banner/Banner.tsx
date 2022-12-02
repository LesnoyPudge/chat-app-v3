import { Button, ChildrenAsNodeOrFunction, Conditional, Icon, IModalContext, IOverlayContext, IRefContext, ModalContext, ModalContextProvider, OverlayContext, OverlayContextProvider, OverlayPortal, RefContext, RefContextProvider, RelativelyPositioned, Tooltip } from '@components';
import { useMousePosition, useRelativePosition, useThrottle, useWindowSize } from '@hooks';
import { animated, useTransition } from '@react-spring/web';
import { PropsWithChildrenAsFunction, PropsWithChildrenAsNodeOrFunction } from '@types';
import { fpsToMs, twClassNames } from '@utils';
import { CSSProperties, FC, PropsWithChildren, RefObject, useContext, useEffect, useRef, useState } from 'react';
import { RefContextProviderV2, RefContextV2 } from 'src/components/contexts/RefContextProviderV2/RefContextProviderV2';
import { EscapeBlock } from 'src/components/modals/components';
import { OverlayItem } from 'src/components/overlay/OverlayItem/OverlayItem';
import { TooltipV2 } from 'src/components/overlay/TooltipV2';
import { useEventListener } from 'usehooks-ts';
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

export const Banner: FC = () => {
    const { updateEscapeBlock } = useContext(ModalContext) as IModalContext;
    const [bannerColor, setBannerColor] = useState('#ffffff');

    return (
        <div className={styles.banner} style={{ backgroundColor: bannerColor }}>
            <OverlayContextProvider>
                {({ toggle }) => (
                    <RefContextProviderV2>
                        <button className='bg-rose-700' onClick={toggle}>
                            <>wow amazing</>
                        </button>

                        <SomeOverlayWindow/>
                    </RefContextProviderV2>
                )}
            </OverlayContextProvider>

            <ModalContextProvider>
                {({ toggleModal, isOpen }) => {
                    return (
                        <EscapeBlock isOpen={isOpen} update={updateEscapeBlock}>
                            <RefContextProvider>
                                <Button
                                    className={twClassNames(
                                        styles.bannerButton.base, 
                                        {
                                            [styles.bannerButton.active]: isOpen,
                                        },
                                    )}
                                    isntStyled
                                    onClick={toggleModal}
                                >
                                    <Icon
                                        className={styles.bannerIcon}
                                        iconId='dropper-icon'
                                    />
                                </Button>

                                <ColorPicker
                                    color={bannerColor}
                                    onChange={setBannerColor}
                                />

                                <Tooltip position='top'>
                                    <>Изменить цвет баннера</>
                                </Tooltip>
                            </RefContextProvider>
                        </EscapeBlock>
                    );
                }}
            </ModalContextProvider>
        </div>
    );
};

const SomeOverlayWindow: FC = () => {
    const { targetRef } = useContext(RefContextV2) as RefContextV2;
    const { isExist } = useContext(OverlayContext) as IOverlayContext;
    const transition = useTransition(isExist, {
        from: {
            opacity: 0,
        },
        enter: {
            opacity: 1,
        },
        leave: {
            opacity: 0,
        },
    });

    return transition((style, isRendered) => (
        <OverlayItem 
            isRendered={isRendered} 
            blockable 
            blocking 
            closeOnEscape 
            closeOnClickOutside
        >
            <RelativelyPositioned
                preferredAligment='top'
                targetRefOrRect={targetRef}
            >
                <animated.div style={style} className='bg-rose-800'>
                    <div>
                        <span>cool modal</span>
                        
                        <OverlayContextProvider>
                            {({ toggle, isExist }) => (
                                <>
                                    <RefContextProviderV2>
                                        <button 
                                            className='bg-sky-500'
                                            onClick={toggle}
                                        >
                                            <>and there is another</>
                                        </button>

                                        <TooltipV2 preferredAligment='top'>
                                            <>this button will open second modal</>
                                        </TooltipV2>
                                    </RefContextProviderV2>
                                    

                                    <OverlayItem 
                                        isRendered={isExist} 
                                        blockable 
                                        blocking 
                                        closeOnEscape 
                                        closeOnClickOutside
                                    >
                                        <div className='bg-emerald-400'>second amazing modal!</div>
                                    </OverlayItem>
                                </>
                            )}
                        </OverlayContextProvider>

                    </div>
                </animated.div>
            </RelativelyPositioned>
        </OverlayItem>
    ));
};