import { twClassNames } from '@utils';
import { FC, useEffect } from 'react';
import { Editable, ReactEditor, useSlateStatic } from 'slate-react';
import { EditableProps, RenderElementProps } from 'slate-react/dist/components/editable';
import { useIsFirstRender } from 'usehooks-ts';
import { SlateEmoji, SlateLink, SlateParagraph } from './components';
import { Key } from 'ts-key-enum';
import { Descendant } from 'slate';



interface SlateEditor {
    className?: string;
    label: string;
    placeholder?: string;
    rest?: Omit<EditableProps, keyof SlateEditor>;
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    onSubmit?: (value: Descendant[]) => void;
}

const baseClassName = 'w-full break-all px-2 h-fit min-h-[44px] message-font-size message-y-padding';

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
    onSubmit,
}) => {
    const editor = useSlateStatic();
    const isFirstRender = useIsFirstRender();

    useEffect(() => {
        if (!isFirstRender) return;
        const prevFocusedElem = document.activeElement as HTMLElement;
        ReactEditor.focus(editor);
        ReactEditor.blur(editor);
        prevFocusedElem && prevFocusedElem.focus();
    }, [editor, isFirstRender]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === Key.Enter && !e.shiftKey) {
            e.preventDefault();
            onSubmit && onSubmit(editor.children);
        } 
        
        onKeyDown && onKeyDown(e);
    };

    return (
        <Editable
            className={twClassNames(baseClassName, className)}
            placeholder={placeholder}
            suppressContentEditableWarning
            renderElement={renderElement}
            onKeyDown={handleKeyDown}
            aria-label={label}
            {...rest}
        />
    );
};