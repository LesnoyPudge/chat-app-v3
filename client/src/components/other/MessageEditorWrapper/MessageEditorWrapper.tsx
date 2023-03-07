import useResizeObserver from '@react-hook/resize-observer';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, useRef, useEffect } from 'react';
import { useFocused, useSlateStatic, ReactEditor } from 'slate-react';
import { Scrollable } from '@components';



const styles = {
    wrapper: {
        base: 'rounded-lg bg-primary-100 m-4 min-h-[44px] max-h-[50vh]',
        focused: 'focused',
    },
    scrollable: 'h-full',
    content: 'flex',
};

export const MessageEditorWrapper: FC<PropsWithChildrenAndClassName> = ({ 
    className = '',
    children,
}) => {
    const isEditorFocused = useFocused();
    const editor = useSlateStatic();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        editorRef.current = ReactEditor.toDOMNode(editor, editor);
    }, [editor]);

    useResizeObserver(editorRef, (entry) => {
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
            <Scrollable className={styles.scrollable} small>
                <div className={styles.content}>
                    {children}
                </div>
            </Scrollable>
        </div>
    );
};