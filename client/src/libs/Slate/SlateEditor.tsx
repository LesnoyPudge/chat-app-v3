import { IRefContext, RefContext, RefContextProvider } from '@components';
import classNames from 'classnames';
import { FC, useContext, useEffect } from 'react';
import { Editor, Text, Transforms } from 'slate';
import { Editable, ReactEditor, useSlate } from 'slate-react';
import { EditableProps } from 'slate-react/dist/components/editable';
import { twMerge } from 'tailwind-merge';
import { Emoji } from './components';



interface ISlateEditor {
    className?: string;
    placeholder?: string;
    rest?: Omit<EditableProps, keyof ISlateEditor>;
}

export const SlateEditor: FC<ISlateEditor> = ({
    className = '',
    placeholder = 'Введите текст',
    rest,
}) => {
    const editor = useSlate();

    useEffect(() => {
        const prevFocusedElem = document.activeElement as HTMLDivElement;
        ReactEditor.focus(editor);
        ReactEditor.blur(editor);
        prevFocusedElem && prevFocusedElem.focus();
    }, [editor]);

    return (
        <Editable
            autoFocus={false}
            className={twMerge(classNames('w-full overflow-y-auto break-all', className))}
            onKeyDown={e => {
                if (e.code === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    console.log('submit');
                }
            }}
            placeholder={placeholder}

            // renderLeaf={({ attributes, children, leaf, text }) => {
            //     return <></>;
            // }}
            renderElement={({ attributes, children, element }) => {
                switch (element.type) {
                case 'paragraph':
                    return <p {...attributes}>{children}</p>;
                case 'link':
                    return <a 
                        href={element.url} 
                        target='_blank' 
                        rel='noreferrer' 
                        {...attributes}
                    >
                        {children}
                    </a>;
                case 'emoji':
                    return <Emoji 
                        code={element.code} 
                        props={{ attributes, children, element }}
                    />;
                default:
                    return <>{children}</>;
                }
            }}
            {...rest}
        />
    );
};