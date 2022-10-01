import { IRefContext, RefContext, RefContextProvider } from '@components';
import classNames from 'classnames';
import { FC, useContext, useEffect } from 'react';
import { Editable } from 'slate-react';
import { EditableProps } from 'slate-react/dist/components/editable';
import { twMerge } from 'tailwind-merge';



interface ISlateEditor {
    className?: string;
    rest?: Omit<EditableProps, keyof ISlateEditor>;
}

export const SlateEditor: FC<ISlateEditor> = ({
    className = '',
    rest,
}) => {
    return (
        <RefContextProvider>
            <Editable
                autoFocus={false}
                className={twMerge(classNames(
                    'w-full overflow-y-auto break-all', 
                    { [className]: !!className }))
                }
                onKeyDown={e => {
                    if (e.code === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        console.log('submit');
                    }
                }}
                placeholder='wow amazing'
                {...rest}
            />

            <InitEditable/>
        </RefContextProvider>
    );
};

const InitEditable: FC = () => {
    const { target } = useContext(RefContext) as IRefContext;
    
    useEffect(() => {
        if (!target.current) return;

        const prevFocusedElem = document.activeElement as HTMLDivElement;

        target.current.focus();
        target.current.blur();
        prevFocusedElem && prevFocusedElem.focus();
    }, [target]);

    return null;
};