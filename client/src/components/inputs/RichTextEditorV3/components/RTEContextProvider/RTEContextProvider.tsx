import { FC, PropsWithChildren, useMemo, useEffect, createContext, useRef } from 'react';
import { Slate } from 'slate-react';
import { RTEModules } from '@components';
import { Descendant } from 'slate';
import { isProd, logger, noop } from '@utils';



type RTEContextProvider = PropsWithChildren & {
    name: string;
    initialValue?: Descendant[],
    label?: string;
    placeholder?: string;
    maxLength?: number;
    id?: string;
    onChange?: (value: Descendant[]) => void;
    onSubmit?: (value: Descendant[]) => void;
};

export type RTEContextValues = Required<Pick<
    RTEContextProvider,
    'maxLength' | 'label' | 'placeholder' | 'name' | 'onSubmit'
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
    initialValue = RTEModules.Utils.createInitialValue(),
    label = 'Редактор текста',
    placeholder = 'Введите текст',
    maxLength = 2000,
    id = '',
    onChange = noop,
    onSubmit = noop,
    children,
}) => {
    const diff = usePropsDifference(
        name, initialValue, label,
        placeholder, maxLength, id,
        onChange, onSubmit, children,
    );

    const editor = useMemo(() => RTEModules.Utils.createEditorWithPlugins({
        characterLimit: {
            maxLength,
        },
    }), [maxLength]);

    useEffect(() => console.log('diff is: ', diff));

    useEffect(() => {
        editor.normalize({ force: true });
        editor.onChange();
    }, [editor]);

    const contextValues: RTEContextValues = useMemo(() => ({
        maxLength,
        label,
        placeholder,
        name,
        onSubmit,
    }), [label, maxLength, placeholder, name, onSubmit]);

    return (
        <Slate
            editor={editor}
            initialValue={initialValue}
            onValueChange={onChange}
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