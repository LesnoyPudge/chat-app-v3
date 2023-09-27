import { FC, PropsWithChildren, useState } from 'react';
import { Descendant, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact, Slate } from 'slate-react';
import { withEmoji, withLink } from './plugins';
import { getInitialSlateValue } from './utils';




export interface SlateContainer extends PropsWithChildren {
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
    const [editor] = useState(() => createEditorWithPlugins());

    return (
        <Slate
            editor={editor}
            value={value}
            onChange={onChange}
        >
            {children}
        </Slate>
    );
};