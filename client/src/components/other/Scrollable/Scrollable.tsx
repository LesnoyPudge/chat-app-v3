import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { CSSProperties, FC } from 'react';
import { useThrottle } from '@hooks';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import SimpleBarCore from 'simplebar-core';



interface Scrollable extends PropsWithChildrenAndClassName {
    autoHide?: boolean;
    hidden?: boolean;
    withOppositeGutter?: boolean;
    small?: boolean;
    scrollableRef?: (ref: HTMLDivElement) => void;
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
    autoHide = false,
    hidden = false,
    withOppositeGutter = false,
    small = false,
    scrollableRef,
    children,
}) => {
    const { throttle, isThrottling: isAlive } = useThrottle();  

    const handlePoinerMove = () => {
        if (!autoHide) return;
        
        throttle(() => {}, 3000)();
    };

    const getScrollableElementRef = (ref: SimpleBarCore) => {
        if (!scrollableRef) return;
        if (!ref) return;
        scrollableRef(ref.getScrollElement() as HTMLDivElement);
    };

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
                onPointerMove={handlePoinerMove}
                ref={getScrollableElementRef}
            >
                {children}
            </SimpleBar>
        </div>
    );
};