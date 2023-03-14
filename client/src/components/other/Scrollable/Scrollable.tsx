import { PropsWithChildrenAndClassName } from '@types';
import { noop, twClassNames } from '@utils';
import { FC, MutableRefObject, useEffect, useRef } from 'react';
import { useThrottle } from '@hooks';
import 'simplebar-react/dist/simplebar.min.css';
import { SimpleBarCore } from '@reExport';
import SimpleBar from 'simplebar-react';



export interface Scrollable extends PropsWithChildrenAndClassName {
    label?: string;
    direction?: 'horizontal' | 'vertical',
    autoHide?: boolean;
    hidden?: boolean;
    withOppositeGutter?: boolean;
    small?: boolean;
    focusable?: boolean;
    scrollableRef?: MutableRefObject<HTMLDivElement | null>;
    simpleBarRef?: MutableRefObject<SimpleBarCore | null>;
    scrollableContentRef?: MutableRefObject<HTMLDivElement | null>;
}

const styles = {
    wrapper: 'flex flex-1 max-h-full scrollbar',
};

export const Scrollable: FC<Scrollable> = ({
    className = '',
    label,
    direction = 'vertical',
    autoHide = false,
    hidden = false,
    withOppositeGutter = false,
    small = false,
    focusable = false,
    scrollableRef,
    simpleBarRef,
    scrollableContentRef,
    children,
}) => {
    const { throttle, isThrottling: isAlive } = useThrottle();
    const mySimpleBarRef = useRef<SimpleBarCore | null>(null);

    const dataAttributes = {
        'data-direction': direction,
        'data-auto-hide': autoHide,
        'data-hidden': hidden,
        'data-with-opposite-gutter': withOppositeGutter,
        'data-small': small,
        'data-is-alive': isAlive,
    };

    const handlePointerMove = () => {
        if (autoHide) throttle(noop, 1000)();  
    };

    useEffect(() => {
        if (!mySimpleBarRef.current) return;

        const target = mySimpleBarRef.current;

        if (simpleBarRef && !simpleBarRef.current) {
            simpleBarRef.current = target;
        }

        if (scrollableRef && !scrollableRef.current) {
            scrollableRef.current = target.getScrollElement() as HTMLDivElement;
        }

        if (scrollableContentRef && !scrollableContentRef.current) {
            scrollableContentRef.current = target.getContentElement() as HTMLDivElement;
        }

        if (target.contentWrapperEl) {
            const contentWrapper = target.contentWrapperEl;
            
            contentWrapper.tabIndex = focusable ? 0 : -1;
            
            // const overflowStyle = {
            //     vertical: 'hidden scroll',
            //     horizontal: 'scroll hidden',
            // };
            // contentWrapper.style.overflow = overflowStyle[direction];
        }
    }, [direction, focusable, scrollableContentRef, scrollableRef, simpleBarRef]);

    return (
        <SimpleBar 
            className={twClassNames(
                styles.wrapper,
                className,
            )}
            forceVisible
            autoHide={false}
            clickOnTrack
            ariaLabel={label}
            {...dataAttributes}
            onPointerMove={handlePointerMove}
            ref={mySimpleBarRef}
        >
            {children}
        </SimpleBar>
    );
};