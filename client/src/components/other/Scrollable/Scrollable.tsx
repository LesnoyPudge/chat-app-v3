import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { CSSProperties, FC, MutableRefObject, useEffect, useRef } from 'react';
import { useThrottle } from '@hooks';
import 'simplebar-react/dist/simplebar.min.css';
import { SimpleBarCore } from '@reExport';
import SimpleBar from 'simplebar-react';



interface Scrollable extends PropsWithChildrenAndClassName {
    label?: string;
    autoHide?: boolean;
    hidden?: boolean;
    withOppositeGutter?: boolean;
    small?: boolean;
    focusable?: boolean;
    scrollableRef?: MutableRefObject<HTMLDivElement | null>;
    simpleBarRef?: MutableRefObject<SimpleBarCore | null>;
}

const styles = {
    wrapper: 'flex flex-1',
    inner: 'scrollbar absolute inset-0',
    modifiers: {
        withOppositeGutter: 'scrollbar-with-opposite-gutter',
        hidden: 'scrollbar-hidden',
        autoHide: 'scrollbar-auto-hide',
        isAlive: 'scrollbar-is-alive',
        small: 'scrollbar-small',
    },
};

const wrapperStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
};

export const Scrollable: FC<Scrollable> = ({
    className = '',
    label,
    autoHide = false,
    hidden = false,
    withOppositeGutter = false,
    small = false,
    focusable = false,
    scrollableRef,
    simpleBarRef,
    children,
}) => {
    const { throttle, isThrottling: isAlive } = useThrottle();
    const mySimpleBarRef = useRef<SimpleBarCore | null>(null);

    const handlePointerMove = () => {
        if (autoHide) throttle(() => {}, 1000)();  
    };

    const getRef = (ref: SimpleBarCore | null) => {
        if (!ref) return;

        mySimpleBarRef.current = ref;
        
        if (simpleBarRef) {
            simpleBarRef.current = ref;
        }

        if (scrollableRef) {
            scrollableRef.current = ref.getScrollElement() as HTMLDivElement;
        }
    };

    useEffect(() => {
        if (!mySimpleBarRef.current) return;
        if (!mySimpleBarRef.current.contentWrapperEl) return;

        mySimpleBarRef.current.contentWrapperEl.tabIndex = focusable ? 0 : -1;        
    }, [focusable]);

    return (
        <div 
            className={twClassNames(styles.wrapper, className)}
            style={wrapperStyle}
        >
            <SimpleBar 
                className={twClassNames(
                    styles.inner, 
                    { 
                        [styles.modifiers.withOppositeGutter]: withOppositeGutter,
                        [styles.modifiers.hidden]: hidden,
                        [styles.modifiers.autoHide]: autoHide,
                        [styles.modifiers.isAlive]: isAlive, 
                        [styles.modifiers.small]: small,
                    },
                )}
                forceVisible
                autoHide={false}
                clickOnTrack
                ariaLabel={label}
                onPointerMove={handlePointerMove}
                ref={getRef}
            >
                {children}
            </SimpleBar>
        </div>
    );
};