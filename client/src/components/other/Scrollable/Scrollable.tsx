import { PropsWithChildrenAsNodeOrFunction, PropsWithClassName, Size } from '@types';
import { conditional, noop, twClassNames } from '@utils';
import { FC, MutableRefObject, RefObject, useEffect, useLayoutEffect, useRef } from 'react';
import { useSharedResizeObserver, useThrottle } from '@hooks';
import 'simplebar-react/dist/simplebar.min.css';
import { isCallable, SimpleBarCore } from '@reExport';
import SimpleBar from 'simplebar-react';
import useResizeObserver from '@react-hook/resize-observer';

// import 'overlayscrollbars/overlayscrollbars.css';
// import { 
//     OverlayScrollbars, 
//     ScrollbarsHidingPlugin, 
//     SizeObserverPlugin, 
//     ClickScrollPlugin, 
// } from 'overlayscrollbars';
import { ChildrenAsNodeOrFunction } from 'src/components/helpers';
import { useLatest } from 'react-use';



// interface ChildrenArgs {
//     scrollableNodeRef: MutableRefObject<HTMLElement | undefined>;
//     scrollableNodeProps: {
//         className: string;
//         ref: MutableRefObject<HTMLElement | undefined>;
//     };
//     contentNodeRef: MutableRefObject<HTMLElement | undefined>;
//     contentNodeProps: {
//         className: string;
//         ref: MutableRefObject<HTMLElement | undefined>;
//     };
// }

export interface Scrollable extends PropsWithClassName, 
PropsWithChildrenAsNodeOrFunction<RefObject<SimpleBarCore>>
// PropsWithChildrenAsNodeOrFunction<ChildrenArgs> 
{
    label?: string;
    direction?: 'horizontal' | 'vertical',
    autoHide?: boolean;
    hidden?: boolean;
    withOppositeGutter?: boolean;
    small?: boolean;
    focusable?: boolean;
    setSimpleBar?: MutableRefObject<SimpleBarCore | null> | ((el: SimpleBarCore | null) => void);
    setScrollableWrapper?: MutableRefObject<HTMLElement | null> | ((el: HTMLElement | null) => void);
    setScrollable?: MutableRefObject<HTMLElement | null> | ((el: HTMLElement | null) => void);
    onContentResize?: (size: Size) => void;
}

const styles = {
    wrapper: 'flex flex-1 relative max-h-full',
    scrollable: 'absolute inset-0 simplebar-custom',
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
    children,
    onContentResize,
    setScrollable = noop,
    setScrollableWrapper = noop,
    setSimpleBar = noop,
}) => {
    const { throttle, isThrottling: isAlive } = useThrottle();
    const simpleBarApiRef = useRef<SimpleBarCore | null>(null);
    const handleKeepAliveRef = useLatest(() => {
        if (autoHide) throttle(noop, 1000)();  
    });

    const dataAttributes = {
        'data-direction': direction,
        'data-auto-hide': autoHide,
        'data-with-opposite-gutter': withOppositeGutter,
        'data-is-alive': isAlive,
    };

    const scrollbarSizes = {
        '--scrollbar-thickness': small ? 10 : hidden ? 0 : 10,
        '--track-thickness': small ? 6 : hidden ? 0 : 8,
        '--thumb-thickness': small ? 6 : hidden ? 0 : 8,
    };

    const scrollbarStyles: Record<keyof typeof scrollbarSizes, string> = {
        '--scrollbar-thickness': scrollbarSizes['--scrollbar-thickness'] + 'px',
        '--track-thickness': scrollbarSizes['--track-thickness'] + 'px',
        '--thumb-thickness': scrollbarSizes['--thumb-thickness'] + 'px',
    };

    const setRef = (simpleBarApi: SimpleBarCore | null) => {
        if (!simpleBarApi) return;

        simpleBarApiRef.current = simpleBarApi;

        isCallable(setSimpleBar) 
            ? setSimpleBar(simpleBarApi) 
            : setSimpleBar.current = simpleBarApi
        ;
        
        isCallable(setScrollable) 
            ? setScrollable(simpleBarApi.contentEl) 
            : setScrollable.current = simpleBarApi.contentEl
        ;

        isCallable(setScrollableWrapper) 
            ? setScrollableWrapper(simpleBarApi.contentWrapperEl) 
            : setScrollableWrapper.current = simpleBarApi.contentWrapperEl
        ;
    };

    useSharedResizeObserver(simpleBarApiRef.current?.contentEl, (entry) => {
        if (!onContentResize) return;

        const isHorizontal = direction === 'horizontal';
        const isVertical = direction === 'vertical';
        const scrollbarSize = scrollbarSizes['--scrollbar-thickness'];
        const scrollbarSizeWithGutter = scrollbarSize * 2;

        const padding = {
            vertical: conditional(
                conditional(
                    scrollbarSizeWithGutter,
                    scrollbarSize,
                    withOppositeGutter,
                ),
                0, 
                isHorizontal,
            ),
            horizontal: conditional(
                conditional(
                    scrollbarSizeWithGutter,
                    scrollbarSize,
                    withOppositeGutter,
                ),
                0, 
                isVertical,
            ),
        };

        onContentResize({
            width: entry.borderBoxSize[0].inlineSize + padding.horizontal,
            height: entry.borderBoxSize[0].blockSize + padding.vertical,
        });
    });

    useEffect(() => {
        if (!simpleBarApiRef.current) return;

        const defaultListener = simpleBarApiRef.current.drag;

        simpleBarApiRef.current.drag = (...rest) => {
            handleKeepAliveRef.current();
            defaultListener(...rest);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useEffect(() => {
        if (!simpleBarApiRef.current) return;

        const wrapper = simpleBarApiRef.current.contentWrapperEl;
        if (!wrapper) return;
        
        wrapper.tabIndex = focusable ? 0 : -1;
    }, [focusable]);
    
    return (
        <div className={twClassNames(
            styles.wrapper,
            className,
        )}>
            <SimpleBar 
                className={styles.scrollable}
                style={scrollbarStyles as React.CSSProperties}
                forceVisible
                autoHide={false}
                clickOnTrack
                ariaLabel={label}
                {...dataAttributes}
                onPointerMove={handleKeepAliveRef.current}
                ref={setRef}
            >
                <ChildrenAsNodeOrFunction args={simpleBarApiRef}>
                    {children}
                </ChildrenAsNodeOrFunction>
            </SimpleBar>
        </div>
    );
};