import { twClassNames } from '@utils';
import { FC, useEffect } from 'react';
import { Editable, ReactEditor, useSlateStatic } from 'slate-react';
import { EditableProps, RenderElementProps } from 'slate-react/dist/components/editable';
import { Emoji, Link, Paragraph } from './components';



interface ISlateEditor {
    className?: string;
    placeholder?: string;
    rest?: Omit<EditableProps, keyof ISlateEditor>;
}

const renderElement = ({ attributes, children, element }: RenderElementProps) => {
    switch (element.type) {
    case 'paragraph':
        return <Paragraph attributes={attributes}>{children}</Paragraph>;

    case 'emoji':
        return <Emoji code={element.code} attributes={attributes}>{children}</Emoji>;

    case 'link': 
        return <Link url={element.url} attributes={attributes}>{children}</Link>;

    default:
        return <>{children}</>;
    }
};

const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        console.log('submit');
    }
};

export const SlateEditor: FC<ISlateEditor> = ({
    className = '',
    placeholder = 'Введите текст',
    rest,
}) => {
    const editor = useSlateStatic();
    
    useEffect(() => {
        const prevFocusedElem = document.activeElement as HTMLDivElement;
        ReactEditor.focus(editor);
        ReactEditor.blur(editor);
        prevFocusedElem && prevFocusedElem.focus();
    }, [editor]);

    return (
        <Editable
            autoFocus={false}
            className={twClassNames('w-full break-all h-fit', className)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            renderElement={renderElement}
            {...rest}
        />
    );
};