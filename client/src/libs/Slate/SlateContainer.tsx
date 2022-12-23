import { FC, PropsWithChildren, useLayoutEffect, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Descendant, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact, Slate } from 'slate-react';
import { withEmoji, withLink } from './plugins';



interface SlateContainer extends PropsWithChildren {
    value?: Descendant[];
    onChange?: ((value: Descendant[]) => void) | undefined;
}

const initialValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
];

const createEditorWithPlugins = () => {
    let editor = createEditor();
    editor = withHistory(editor);
    editor = withReact(editor);
    editor = withEmoji(editor);
    editor = withLink(editor);
    
    return editor;
};

export const SlateContainer: FC<SlateContainer> = ({ 
    children,
    value = initialValue,
    onChange,
}) => {
    const [editor] = useState(() => (createEditorWithPlugins()));

    return (
        <ErrorBoundary FallbackComponent={ErrorReset}>
            <Slate 
                editor={editor} 
                value={value}
                onChange={onChange}
            >
                {children}
            </Slate>
        </ErrorBoundary>
    );
};

const ErrorReset: FC<FallbackProps> = ({ resetErrorBoundary }) => {
    useLayoutEffect(() => {
        resetErrorBoundary();
    }, [resetErrorBoundary]);

    return null;
};