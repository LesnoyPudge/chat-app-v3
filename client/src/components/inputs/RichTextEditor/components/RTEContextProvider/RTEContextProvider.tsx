import { FC, PropsWithChildren, useMemo, useEffect, createContext, useRef, useCallback } from 'react';
import { Slate } from 'slate-react';
import { RTEModules, RTETypes } from '@components';
import { BaseSelection, Descendant } from 'slate';
import { isProd, logger, noop } from '@utils';
import { shallowEqual } from 'react-redux';
import reactFastCompare from "react-fast-compare";
import { useLatest } from '@hooks';
import { JSONView } from '@dev';


type RTEContextProvider = PropsWithChildren & {
    name: string;
    value?: RTETypes.Nodes,
    initialValue?: RTETypes.Nodes,
    label?: string;
    placeholder?: string;
    maxLength?: number;
    id?: string;
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

const usePropsDifference = (...props: unknown[]) => {
    const prev = useRef<null | unknown[]>(null);
    if (isProd()) {
        logger.prod.warn('usePropsDifference in production mode');
        return null;
    }

    if (prev.current === null) {
        prev.current = props;
        return null;
    }

    const difference = props.filter((prop, i) => prop !== prev.current![i]);

    if (difference.length === 0) return null;

    return difference;
};

export const RTEContextProvider: FC<RTEContextProvider> = ({
    name,
    value = RTEModules.Utils.createInitialValue(),
    initialValue = RTEModules.Utils.createInitialValue(),
    label = 'Редактор текста',
    placeholder = 'Введите текст',
    maxLength = 2000,
    id = '',
    disabled = false,
    onChange,
    onSubmit = noop,
    onSelectionChange = noop,
    children,
}) => {
    // const diff = usePropsDifference(
    //     name, initialValue, label,
    //     placeholder, maxLength, id,
    //     onChange, onSubmit, children,
    // );
    const valueRef = useLatest(value);
    const editor = useMemo(() => RTEModules.Utils.createEditorWithPlugins({
        characterLimit: {
            maxLength,
        },
    }), [maxLength]);

    // useEffect(() => console.log('diff is: ', diff));

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
        if (Object.is(newValue, valueRef.current)) return;

        onChange(newValue);
    }, [onChange, valueRef]);

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
            onValueChange={_onChange}
            onSelectionChange={onSelectionChange}
            // key={(() => {
            //     const k = id + JSON.stringify(initialValue);
            //     console.log(`key ${k}`);
            //     return k;
            // })()}
        >
            <RTEContext.Provider value={contextValues}>
                {children}
            </RTEContext.Provider>
        </Slate>
    );
};