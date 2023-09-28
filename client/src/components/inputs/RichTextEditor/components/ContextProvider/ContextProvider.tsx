import { SlateContainer, SlateEditor } from '@libs';
import { noop } from '@utils';
import { FC, PropsWithChildren, createContext, useEffect, useMemo } from 'react';
import { Descendant } from 'slate';
import { useSlate, useSlateStatic } from 'slate-react';



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
>> & Required<Pick<
    SlateContainer,
    'value' | 'onChange'
>> & Partial<ContextValues> & PropsWithChildren;

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
    const contextValues: ContextValues = useMemo(() => ({
        label,
        name,
        placeholder,
        onSubmit,
        onKeyDown,
    }), [label, name, onKeyDown, onSubmit, placeholder]);

    return (
        <RichTextEditorContext.Provider value={contextValues}>
            <SlateContainer
                value={value}
                onChange={onChange}
            >
                <Fix value={value}/>

                {children}
            </SlateContainer>
        </RichTextEditorContext.Provider>
    );
};

const Fix: FC<{value: Descendant[]}> = ({
    value,
}) => {
    const editor = useSlateStatic();

    useEffect(() => {
        editor.children = value;
    }, [value, editor]);

    return null;
};