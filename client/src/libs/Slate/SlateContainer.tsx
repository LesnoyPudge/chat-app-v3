import { ChildrenAsNodeOrFunction } from '@components';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { FC, useLayoutEffect, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Descendant, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact, Slate } from 'slate-react';
import { withEmoji, withLink } from './plugins';
import { CustomEditor } from './types';
import { getInitialSlateValue } from './utils';



interface ChildrenArgs {
    editor: CustomEditor;
}

interface SlateContainer extends PropsWithChildrenAsNodeOrFunction<ChildrenArgs> {
    value?: Descendant[];
    onChange?: (value: Descendant[]) => void;
}

const initialValue = getInitialSlateValue();


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
                <ChildrenAsNodeOrFunction args={{ editor }}>
                    {children}
                </ChildrenAsNodeOrFunction>
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