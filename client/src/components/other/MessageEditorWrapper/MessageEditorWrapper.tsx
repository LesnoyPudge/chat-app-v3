import useResizeObserver from '@react-hook/resize-observer';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, useRef } from 'react';
import { useSlateStatic } from 'slate-react';
import { Scrollable } from '@components';
import { useFocus } from '@hooks';
import { useGetSlateEditorElementRef } from '@libs';



const styles = {
    wrapper: {
        base: 'rounded-lg bg-primary-100 m-4 min-h-[44px] max-h-[50vh]',
        focused: 'focused',
    },
    scrollable: 'h-full',
};

export const MessageEditorWrapper: FC<PropsWithChildrenAndClassName> = ({ 
    className = '',
    children,
}) => {
    const editor = useSlateStatic();
    const editorRef = useGetSlateEditorElementRef(editor);
    const isEditorFocused = useFocus(editorRef);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const scrollableContentRef = useRef<HTMLDivElement>(null);

    useResizeObserver(scrollableContentRef, (entry) => {
        if (!wrapperRef.current) return;
        wrapperRef.current.style.height = entry.borderBoxSize[0].blockSize + 'px';
    });
    
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
                scrollableContentRef={scrollableContentRef}
            >
                {children}
            </Scrollable>
        </div>
    );
};