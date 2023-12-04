import { FC, PropsWithChildren, useMemo, useEffect } from 'react';
import { Slate } from 'slate-react';
import { RTEModules } from '@components';
import { Descendant } from 'slate';
import { noop } from '@utils';



type RTEContainer = PropsWithChildren & {
    initialValue?: Descendant[],
    id?: string;
    onChange?: (value: Descendant[]) => void;
};

export const RTEContainer: FC<RTEContainer> = ({
    initialValue = RTEModules.Utils.createInitialValue(),
    id = String(Math.random()),
    onChange = noop,
    children,
}) => {
    const editor = useMemo(() => RTEModules.Utils.createEditorWithPlugins({
        characterLimit: {
            maxLength: 2000,
        },
    }), []);

    useEffect(() => {
        editor.normalize({ force: true });
        editor.onChange();
    }, [editor]);

    return (
        <Slate
            editor={editor}
            initialValue={initialValue}
            onValueChange={onChange}
            key={id}
        >
            {children}
        </Slate>
    );
};