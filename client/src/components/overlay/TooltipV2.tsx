import { FC, PropsWithChildren, useContext, useState } from 'react';
import { OverlayPortal, Conditional, RelativelyPositioned } from '@components';
import { RefContextV2 } from '../contexts/RefContextProviderV2/RefContextProviderV2';
import { animated, useTransition } from '@react-spring/web';
import { useEventListener } from 'usehooks-ts';
import { twClassNames } from '@utils';



interface TooltipV2 extends PropsWithChildren {
    preferredAligment: 'top' | 'left' | 'bottom' | 'right';
}

// const alligmentStyles = {
//     // top: '-translate-x-1/2',
//     // bottom: '-translate-x-1/2',
//     // left: '-translate-y-1/2',
//     // right: '-translate-y-1/2',
// };

export const TooltipV2: FC<TooltipV2> = ({
    preferredAligment,
    children,
}) => {
    const { targetRef } = useContext(RefContextV2) as RefContextV2;
    const [isExist, setIsExist] = useState(false);
    const transition = useTransition(isExist || true, {
        from: {
            opacity: 0,
        },
        enter: {
            opacity: 1,
        },
        leave: {
            opacity: 0,
        },
        config: {
            duration: 175,
        },
    });

    const open = () => setIsExist(true);
    const close = () => setIsExist(false);
    const handleFocusIn = (e: FocusEvent) => {
        if (e.target === targetRef.current) open();
    };
    const handleFocusOut = (e: FocusEvent) => {
        if (e.target === targetRef.current) close();
    };

    useEventListener('focusin', handleFocusIn, targetRef);
    useEventListener('focusout', handleFocusOut, targetRef);
    useEventListener('mouseenter', open, targetRef);
    useEventListener('mouseleave', close, targetRef);

    const alligmentStyles = {
        top: twClassNames('-translate-y-4 transition-transform', { '-translate-y-0': isExist }),
        bottom: '',
        left: '',
        right: '',
    };
    // <div className='-translate-y-4 '></div>;
    return transition((style, isRendered) => (
        <Conditional isRendered={isRendered}>
            <OverlayPortal>
                <div className='overlay-item-wrapper'>
                    <RelativelyPositioned
                        preferredAligment={preferredAligment} 
                        targetRefOrRect={targetRef}
                        boundsSize={20}
                        spacing={20}
                        swapableAligment
                        alligmentStyles={alligmentStyles}
                        centered
                    >
                        <animated.div style={style} className={'bg-slate-800 flex shrink-0 w-max h-14'}>
                            {children}
                        </animated.div>
                    </RelativelyPositioned>
                </div>
            </OverlayPortal>
        </Conditional>
    ));
};