import { SlateContainer, SlateEditor } from '@libs';
import { noop } from '@utils';
import { FC, PropsWithChildren, createContext, useMemo, useState } from 'react';
import { Descendant, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, useSlate, useSlateStatic, withReact } from 'slate-react';
import { withEmoji, withLink } from 'src/libs/Slate/plugins';



export type ContextValues = Required<Pick<
    SlateEditor,
    'label' | 'name' | 'placeholder'
>> & {
    onSubmit: (value: Descendant[]) => void;
    onKeyDown: (e: KeyboardEvent) => void;
}

type ContextProvider = Required<Pick<
    ContextValues,
    'label' | 'name' | 'placeholder'
>> & Partial<ContextValues> & PropsWithChildren & {
    value: Descendant[];
    onChange: (value: Descendant[]) => void;
};

const createEditorWithPlugins = () => {
    let editor = createEditor();
    editor = withHistory(editor);
    editor = withReact(editor);
    editor = withEmoji(editor);
    editor = withLink(editor);

    // const normalizeNode = editor.normalizeNode;

    // editor.normalizeNode = (entry, options) => {
    //     console.log('normalizeNode', entry, options);

    //     return normalizeNode(entry, options);
    // };

    return editor;
};

export const RichTextEditorContext = createContext(undefined as unknown as ContextValues);

export const ContextProvider: FC<ContextProvider> = ({
    label,
    name,
    placeholder,
    value,
    children,
    onChange,
    onSubmit = noop,
    onKeyDown = noop,
}) => {
    const [editor] = useState(() => createEditorWithPlugins());

    const contextValues: ContextValues = useMemo(() => ({
        label,
        name,
        placeholder,
        onSubmit,
        onKeyDown,
    }), [label, name, onKeyDown, onSubmit, placeholder]);

    return (
        <RichTextEditorContext.Provider value={contextValues}>
            <Slate
                editor={editor}
                value={value}
                onChange={onChange}
            >
                {children}
            </Slate>
        </RichTextEditorContext.Provider>
    );
};