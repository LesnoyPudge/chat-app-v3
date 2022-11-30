import { Button, ChildrenAsNodeOrFunction, Conditional, Icon, IModalContext, IOverlayContext, IRefContext, ModalContext, ModalContextProvider, OverlayContext, OverlayContextProvider, OverlayPortal, RefContext, RefContextProvider, Tooltip } from '@components';
import { useThrottle, useWindowSize } from '@hooks';
import { animated, useTransition } from '@react-spring/web';
import { PropsWithChildrenAsFunction, PropsWithChildrenAsNodeOrFunction } from '@types';
import { fpsToMs, twClassNames } from '@utils';
import { CSSProperties, FC, PropsWithChildren, RefObject, useContext, useEffect, useRef, useState } from 'react';
import { EscapeBlock } from 'src/components/modals/components';
import { OverlayItem } from 'src/components/overlay/OverlayItem/OverlayItem';
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
                    <RefContextProvider>
                        <div>
                            <button className='bg-rose-700' onClick={toggle}>
                                <>wow amazing</>
                            </button>
                        </div>

                        <SomeOverlayWindow/>
                    </RefContextProvider>
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
    const { target } = useContext(RefContext) as IRefContext;
    return transition((style, isRendered) => (
        <OverlayItem isRendered={isRendered}>
            <Positioned preferredPosition='left' targetRef={target} spacing={20}>
                <animated.div style={style} className='bg-rose-800'>
                    <>wow amazing</>
                </animated.div>
            </Positioned>
        </OverlayItem>
    ));
};

interface IPositioned extends PropsWithChildren {
    inBounds?: boolean;
    boundsSize?: number;
    targetRef: RefObject<HTMLElement>;
    preferredPosition: 'top' | 'bottom' | 'left' | 'right';
    spacing?: number;
}

interface GetAvailablePositionsArgs {
    boundsSize: number;
    targetRect: {
        top: number; 
        bottom: number; 
        left: number; 
        right: number;
    };
    wrapperRect: {
        width: number;
        height: number;
    }
}

interface GetAvailablePositionsReturn {
    top: boolean; 
    bottom: boolean; 
    left: boolean; 
    right: boolean;
}

type GetAvailablePositionsType = (args: GetAvailablePositionsArgs) => GetAvailablePositionsReturn;

const Positioned: FC<IPositioned> = ({
    inBounds = false,
    // boundsSize = 20,
    targetRef,
    // preferredPosition,
    // spacing = 0,
    children,
}) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const windowSize = useWindowSize();
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [targetRect, setTargetRect] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    });
    const { throttle } = useThrottle();
    useEffect(() => {
        const m = throttle((e: MouseEvent) => {
            setTargetRect({ top: e.clientY, bottom: e.clientY, left: e.clientX, right: e.clientX });
        }, fpsToMs(60));
        document.addEventListener('mousemove', m);
        return () => document.removeEventListener('mousemove', m);
    }, []);

    useEffect(() => {
        if (!wrapperRef.current) return;
        if (!targetRef.current) return;
        const preferredPosition = 'right';
        // wrapperRef.current.textContent = preferredPosition;
        const spacing = 20;
        const boundsSize = 100;
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        // const targetRect = targetRef.current.getBoundingClientRect();

        const bounds = {
            top: boundsSize,
            bottom: window.innerHeight - boundsSize,
            left: boundsSize,
            right: window.innerWidth - boundsSize,
        };
        // console.log(bounds, window.innerWidth);
        const getAvailablePositions: GetAvailablePositionsType = ({
            boundsSize,
            targetRect,
            wrapperRect,
        }) => {
            return {
                top: (targetRect.top - bounds.top - spacing) >= wrapperRect.height,
                bottom: (bounds.bottom - targetRect.bottom - spacing) >= wrapperRect.height,
                left: (targetRect.left - bounds.left - spacing) >= wrapperRect.width,
                right: (bounds.right - targetRect.right - spacing) >= wrapperRect.width,
            };
        };

        const availablePositions = getAvailablePositions({
            boundsSize,
            targetRect,
            wrapperRect,
        });
        
        // console.log('availablePositions', availablePositions);
        // console.log('wrapperRect', wrapperRect);
        // console.log('targetRect', targetRect);
        // console.log('windowSize', windowSize);
        // console.log(bounds);
        const getPositions = () => {
            return {
                top: {
                    top: Math.max(bounds.top, Math.min(bounds.bottom - wrapperRect.height, targetRect.bottom - wrapperRect.height - spacing)),
                    left: Math.min(bounds.right - wrapperRect.width, Math.max(bounds.left, targetRect.left)),
                },
                bottom: {
                    top: Math.max(bounds.top, Math.min(bounds.bottom - wrapperRect.height, targetRect.bottom + spacing)),
                    left: Math.min(bounds.right - wrapperRect.width, Math.max(bounds.left, targetRect.left)),
                },
                left: {
                    top: Math.max(bounds.top, Math.min(bounds.bottom - wrapperRect.height, targetRect.bottom)),
                    left: Math.min(bounds.right - wrapperRect.width, Math.max(bounds.left, targetRect.left - wrapperRect.width - spacing)),
                },
                right: {
                    top: Math.max(bounds.top, Math.min(bounds.bottom - wrapperRect.height, targetRect.bottom)),
                    left: Math.min(bounds.right - wrapperRect.width, Math.max(bounds.left, targetRect.left + spacing)),
                },
            };
        };

        const positions = getPositions();

        setPosition(() => {
            const {
                top,
                bottom,
                left,
                right,
            } = availablePositions;
            return positions[preferredPosition];
            const noSpaceAvailable = !top && !bottom && !left && !right;

            if (noSpaceAvailable) return positions[preferredPosition];
            if (availablePositions[preferredPosition]) return positions[preferredPosition];

            const variants = {
                top: (
                    (bottom && positions.bottom) || 
                    (left && positions.left) || 
                    (right && positions.right) || 
                    positions[preferredPosition]
                ),
                bottom: (
                    (top && positions.top) ||
                    (left && positions.left) || 
                    (right && positions.right) || 
                    positions[preferredPosition]
                ),
                left: (
                    (right && positions.right) ||
                    (top && positions.top) || 
                    (bottom && positions.bottom) || 
                    positions[preferredPosition]
                ),
                right: (
                    (left && positions.left) ||
                    (top && positions.top) || 
                    (bottom && positions.bottom) || 
                    positions[preferredPosition]
                ),
            };

            return variants[preferredPosition];
        });
    }, [targetRect, targetRef]);
    
    useEffect(() => {console.log(position);}, [position]);

    return (
        <div
            className='w-min absolute'
            style={position}
            ref={wrapperRef}
        >
            {children}
        </div>
    );
};