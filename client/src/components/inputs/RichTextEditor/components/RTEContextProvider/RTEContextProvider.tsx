import { FC, PropsWithChildren, useMemo, useEffect, createContext, useRef, useCallback } from 'react';
import { Slate } from 'slate-react';
import { RTEModules, RTETypes } from '@components';
import { BaseSelection } from 'slate';
import { noop } from '@utils';
import reactFastCompare from 'react-fast-compare';



type RTEContextProvider = PropsWithChildren & {
    name: string;
    value?: RTETypes.Nodes,
    label?: string;
    placeholder?: string;
    maxLength?: number;
    disabled?: boolean;
    onChange?: (value: RTETypes.Nodes) => void;
    onSubmit?: (value: RTETypes.Nodes, editor: RTETypes.Editor) => void;
    onSelectionChange?: (selection: BaseSelection) => void;
};

export type RTEContextValues = Required<Pick<
    RTEContextProvider,
    'maxLength' | 'label' | 'placeholder' | 'name' | 'onSubmit' | 'disabled'
>>;

export const RTEContext = createContext<RTEContextValues>();

export const RTEContextProvider: FC<RTEContextProvider> = ({
    name,
    value = RTEModules.Utils.createInitialValue(),
    label = 'Редактор текста',
    placeholder = 'Введите текст',
    maxLength = 2000,
    disabled = false,
    onChange,
    onSubmit = noop,
    onSelectionChange = noop,
    children,
}) => {
    const lastValueRef = useRef(value);
    const editor = useMemo(() => RTEModules.Utils.createEditorWithPlugins({
        characterLimit: {
            maxLength,
        },
    }), [maxLength]);

    useEffect(() => {
        // todo: import from lesnoypudge/utils, not from redux
        // use deepEqual???
        // if (shallowEqual(editor.children, value)) return;
        if (reactFastCompare(editor.children, value)) return;

        editor.delete({
            at: {
                anchor: editor.start([]),
                focus: editor.end([]),
            },
        });
        editor.children = value;
        editor.normalize({ force: true });
        editor.onChange();

    }, [value, editor]);

    useEffect(() => {
        editor.normalize({ force: true });
        editor.onChange();
    }, [editor]);

    const _onChange: NonNullable<typeof onChange> = useCallback((newValue) => {
        if (!onChange) return;
        if (Object.is(newValue, lastValueRef.current)) return;

        lastValueRef.current = newValue;
        onChange(newValue);
    }, [onChange]);

    const contextValues: RTEContextValues = useMemo(() => ({
        maxLength,
        label,
        placeholder,
        name,
        disabled,
        onSubmit,
    }), [label, maxLength, placeholder, name, disabled, onSubmit]);

    return (
        <Slate
            editor={editor}
            initialValue={value}
            onChange={_onChange}
            onSelectionChange={onSelectionChange}
        >
            <RTEContext.Provider value={contextValues}>
                {children}
            </RTEContext.Provider>
        </Slate>
    );
};