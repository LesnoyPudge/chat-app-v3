import { FC, PropsWithChildren, useMemo } from 'react';
import { Descendant, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact, Slate } from 'slate-react';
import { withEmoji, withLink } from './plugins';



interface ISlateContainer extends PropsWithChildren {
    value?: Descendant[];
    onChange?: ((value: Descendant[]) => void) | undefined;
}

const initialValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
];

const plugins = () => {
    let editor = createEditor();
    editor = withHistory(editor);
    editor = withReact(editor);
    editor = withEmoji(editor);
    editor = withLink(editor);
    return editor;
};

export const SlateContainer: FC<ISlateContainer> = ({ 
    children,
    value = initialValue,
    onChange,
}) => {
    const editor = useMemo(plugins, []);

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