import { twClassNames } from '@utils';
import { FC, useEffect } from 'react';
import { Editable, ReactEditor, useSlateStatic } from 'slate-react';
import { EditableProps, RenderElementProps } from 'slate-react/dist/components/editable';
import { SlateEmoji, SlateLink, SlateParagraph } from './components';



interface SlateEditor {
    className?: string;
    label: string;
    placeholder?: string;
    rest?: Omit<EditableProps, keyof SlateEditor>;
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

const baseClassName = 'w-full break-all h-fit';

const renderElement = ({ attributes, children, element }: RenderElementProps) => {
    switch (element.type) {
    case 'paragraph':
        return <SlateParagraph attributes={attributes}>{children}</SlateParagraph>;

    case 'emoji':
        return <SlateEmoji code={element.code} attributes={attributes}>{children}</SlateEmoji>;

    case 'link': 
        return <SlateLink url={element.url} attributes={attributes}>{children}</SlateLink>;

    default:
        return <>{children}</>;
    }
};

export const SlateEditor: FC<SlateEditor> = ({
    className = '',
    placeholder = 'Введите текст',
    label,
    rest,
    onKeyDown,
}) => {
    const editor = useSlateStatic();
    
    useEffect(() => {
        const prevFocusedElem = document.activeElement as HTMLElement;
        ReactEditor.focus(editor);
        ReactEditor.blur(editor);
        prevFocusedElem && prevFocusedElem.focus();
    }, [editor]);

    return (
        <Editable
            className={twClassNames(baseClassName, className)}
            placeholder={placeholder}
            suppressContentEditableWarning
            renderElement={renderElement}
            onKeyDown={onKeyDown}
            aria-label={label}
            {...rest}
        />
    );
};