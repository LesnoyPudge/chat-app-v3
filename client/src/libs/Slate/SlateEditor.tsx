import { twClassNames } from '@utils';
import { FC, useEffect } from 'react';
import { Editable, ReactEditor, useSlateStatic } from 'slate-react';
import { EditableProps, RenderElementProps } from 'slate-react/dist/components/editable';
import { SlateEmoji, SlateLink, SlateParagraph } from './components';



interface SlateEditor {
    className?: string;
    placeholder?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    rest?: Omit<EditableProps, keyof SlateEditor>;
}

const baseClassName = 'w-full break-all h-fit';

export const SlateEditor: FC<SlateEditor> = ({
    className = '',
    placeholder = 'Введите текст',
    onKeyDown,
    rest,
}) => {
    const editor = useSlateStatic();
    
    useEffect(() => {
        const prevFocusedElem = document.activeElement as HTMLElement;
        ReactEditor.focus(editor);
        ReactEditor.blur(editor);
        prevFocusedElem && prevFocusedElem.focus();
    }, [editor]);

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

    return (
        <Editable
            className={twClassNames(baseClassName, className)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            renderElement={renderElement}
            suppressContentEditableWarning
            {...rest}
        />
    );
};