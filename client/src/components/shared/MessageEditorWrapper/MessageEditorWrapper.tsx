import { PropsWithChildrenAndClassName, Size } from '@types';
import { twClassNames } from '@utils';
import { FC, useRef } from 'react';
import { useFocused } from 'slate-react';
import { Scrollable } from '@components';



const styles = {
    wrapper: {
        base: 'rounded-lg bg-primary-100 min-h-[44px] max-h-[50vh]',
        focused: 'focused',
    },
    scrollable: 'h-full',
};

export const MessageEditorWrapper: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    const isEditorFocused = useFocused();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const scrollableContentRef = useRef<HTMLDivElement>(null);

    const handleSizeChange = (size: Size) => {
        if (!wrapperRef.current) return;
        wrapperRef.current.style.height = size.height + 'px';
    };

    return (
        <div
            className={twClassNames(
                styles.wrapper.base,
                { [styles.wrapper.focused]: isEditorFocused },
                className,
            )}
            ref={wrapperRef}
        >
            <Scrollable
                className={styles.scrollable}
                small
                setScrollable={scrollableContentRef}
                withOppositeGutter
                autoHide
                onContentResize={handleSizeChange}
            >
                {children}
            </Scrollable>
        </div>
    );
};