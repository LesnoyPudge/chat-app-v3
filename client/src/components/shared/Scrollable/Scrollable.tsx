import { PropsWithChildrenAsNodeOrFunction, PropsWithClassName, Size } from '@types';
import { conditional, noop, twClassNames } from '@utils';
import { FC, MutableRefObject, RefObject, useCallback, useEffect, useRef } from 'react';
import { useSharedResizeObserver, useStateAndRef, useThrottle, useLatest } from '@hooks';
import 'simplebar-react/dist/simplebar.min.css';
import { isCallable, SimpleBarCore } from '@reExport';
import SimpleBar from 'simplebar-react';
import { ChildrenAsNodeOrFunction } from '@components';



export interface Scrollable extends PropsWithClassName,
PropsWithChildrenAsNodeOrFunction<RefObject<SimpleBarCore>>
{
    label?: string;
    direction?: 'horizontal' | 'vertical',
    autoHide?: boolean;
    hidden?: boolean;
    withOppositeGutter?: boolean;
    small?: boolean;
    focusable?: boolean;
    followContentSize?: boolean;
    // setSimpleBar?: MutableRefObject<SimpleBarCore | null> | ((el: SimpleBarCore | null) => void);
    setScrollableWrapper?: MutableRefObject<HTMLElement | null> | ((el: HTMLElement | null) => void);
    setScrollable?: MutableRefObject<HTMLElement | null> | ((el: HTMLElement | null) => void);
    onContentResize?: (size: Size) => void;
}

const styles = {
    wrapper: {
        base: 'flex flex-1 relative max-h-full',
        sizeFollow: 'flex-auto',
    },
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
    followContentSize = false,
    children,
    onContentResize,
    setScrollable = noop,
    setScrollableWrapper = noop,
    // setSimpleBar = noop,
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { throttle, isThrottling: isAlive } = useThrottle();
    const [simpleBarApi, simpleBarApiRef, setSimpleBarApi] = useStateAndRef<SimpleBarCore | null>(null);
    const handleKeepAliveRef = useLatest(() => {
        if (autoHide) throttle(noop, 1000)();
    });

    const dataAttributes = {
        'data-direction': direction,
        'data-auto-hide': autoHide,
        'data-with-opposite-gutter': withOppositeGutter,
        'data-is-alive': isAlive,
    };

    const scrollbarSizesRef = useLatest({
        '--scrollbar-thickness': small ? 10 : hidden ? 0 : 10,
        '--track-thickness': small ? 6 : hidden ? 0 : 8,
        '--thumb-thickness': small ? 6 : hidden ? 0 : 8,
    });

    const scrollbarStyles: Record<keyof typeof scrollbarSizesRef.current, string> = {
        '--scrollbar-thickness': scrollbarSizesRef.current['--scrollbar-thickness'] + 'px',
        '--track-thickness': scrollbarSizesRef.current['--track-thickness'] + 'px',
        '--thumb-thickness': scrollbarSizesRef.current['--thumb-thickness'] + 'px',
    };

    const setRef = (simpleBarApi: SimpleBarCore | null) => {
        if (!simpleBarApi) return;

        setSimpleBarApi(simpleBarApi);

        // isCallable(setSimpleBar)
        //     ? setSimpleBar(simpleBarApi)
        //     : setSimpleBar.current = simpleBarApi
        // ;

        isCallable(setScrollable)
            ? setScrollable(simpleBarApi.contentEl)
            : setScrollable.current = simpleBarApi.contentEl
        ;

        isCallable(setScrollableWrapper)
            ? setScrollableWrapper(simpleBarApi.contentWrapperEl)
            : setScrollableWrapper.current = simpleBarApi.contentWrapperEl
        ;
    };

    const getCorrectContentSize = useCallback((width: number, height: number) => {
        const isHorizontal = direction === 'horizontal';
        const isVertical = direction === 'vertical';
        const scrollbarSize = scrollbarSizesRef.current['--scrollbar-thickness'];
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

        return {
            width: width + padding.horizontal,
            height: height + padding.vertical,
        };
    }, [direction, scrollbarSizesRef, withOppositeGutter]);

    useSharedResizeObserver(simpleBarApi?.contentEl, (entry) => {
        if (!onContentResize && !followContentSize) return;

        const size = getCorrectContentSize(entry.borderBoxSize[0].inlineSize, entry.borderBoxSize[0].blockSize);

        if (wrapperRef.current) {
            // wrapperRef.current.style.width = size.width + 'px';
            wrapperRef.current.style.height = size.height + 'px';
        }

        (onContentResize || noop)(size);
    });

    useEffect(() => {
        if (!simpleBarApi) return;

        const defaultListener = simpleBarApi.drag;

        simpleBarApi.drag = (...rest) => {
            handleKeepAliveRef.current();
            defaultListener(...rest);
        };
    }, [handleKeepAliveRef, simpleBarApi]);

    useEffect(() => {
        if (!simpleBarApi) return;

        const wrapper = simpleBarApi.contentWrapperEl;
        if (!wrapper) return;

        if (focusable) {
            wrapper.tabIndex = 0;
            return;
        }

        wrapper.removeAttribute('tabIndex');
    }, [focusable, simpleBarApi]);

    return (
        <div
            className={twClassNames(
                styles.wrapper.base,
                { [styles.wrapper.sizeFollow]: followContentSize },
                className,
            )}
            ref={wrapperRef}
        >
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