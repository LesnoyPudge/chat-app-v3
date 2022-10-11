import { FC, PropsWithChildren, useMemo, useState } from 'react';
import { Descendant, createEditor, Element, Node, Transforms, Editor, Text } from 'slate';
import { withHistory } from 'slate-history';
import { withReact, Slate } from 'slate-react';
import { withEmoji } from './plugins';



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

export const SlateContainer: FC<ISlateContainer> = ({ 
    children,
    value = initialValue,
    onChange,
}) => {
    const editor = useMemo(() => withEmoji(withReact(withHistory(createEditor()))), []);

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