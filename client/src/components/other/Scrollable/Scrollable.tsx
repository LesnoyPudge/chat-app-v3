import { PropsWithChildrenAndClassName, Size } from '@types';
import { conditional, noop, twClassNames } from '@utils';
import { FC, MutableRefObject, useEffect, useRef } from 'react';
import { useThrottle } from '@hooks';
import 'simplebar-react/dist/simplebar.min.css';
import { SimpleBarCore } from '@reExport';
import SimpleBar from 'simplebar-react';
import useResizeObserver from '@react-hook/resize-observer';



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
    onContentResize?: (size: Size) => void;
}

const styles = {
    wrapper: 'flex flex-1 relative max-h-full',
    scrollable: 'absolute inset-0 scrollbar',
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
    onContentResize,
}) => {
    const { throttle, isThrottling: isAlive } = useThrottle();
    const mySimpleBarRef = useRef<SimpleBarCore | null>(null);
    const contentRef = useRef<HTMLElement | null>(null);

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

    const handlePointerMove = () => {
        if (autoHide) throttle(noop, 1000)();  
    };

    useEffect(() => {
        if (!mySimpleBarRef.current) return;

        const target = mySimpleBarRef.current;

        if (mySimpleBarRef.current.contentEl) {
            contentRef.current = mySimpleBarRef.current.contentEl;
        }

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
            target.contentWrapperEl.tabIndex = focusable ? 0 : -1;
        }
    }, [direction, focusable, scrollableContentRef, scrollableRef, simpleBarRef]);

    useResizeObserver(contentRef, (entry) => {
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
                onPointerMove={handlePointerMove}
                ref={mySimpleBarRef}
            >
                {children}
            </SimpleBar>
        </div>
    );
};