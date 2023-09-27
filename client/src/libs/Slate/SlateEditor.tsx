import { FC, useCallback, useEffect, useRef } from 'react';
import { Editable, ReactEditor, useSlateStatic, useSlate, useSlateSelector } from 'slate-react';
import { EditableProps, RenderElementProps } from 'slate-react/dist/components/editable';
import { SlateEmoji, SlateLink, SlateParagraph } from './components';
import { Key } from 'ts-key-enum';
import { Descendant } from 'slate';
import { useIsFirstRender } from 'usehooks-ts';
import { useEventListener } from '@hooks';
import { getSlateDomNode } from './utils';



export interface SlateEditor {
    className?: string;
    label?: string;
    placeholder?: string;
    name?: string;
    rest?: Omit<EditableProps, keyof SlateEditor>;
    onKeyDown?: (e: KeyboardEvent) => void;
    onSubmit?: (value: Descendant[]) => void;
}

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
    name,
    rest,
    onKeyDown,
    onSubmit,
}) => {
    const editor = useSlateStatic();

    useEventListener('keydown', (e) => {
        e.stopPropagation();

        if (e.key === Key.Enter && !e.shiftKey) {
            e.preventDefault();
            onSubmit && onSubmit(editor.children);
        }

        onKeyDown && onKeyDown(e);
    }, getSlateDomNode(editor));

    // const isFirstRender = useIsFirstRender();


    // useEffect(() => {
    //     if (!isFirstRender) return;
    //     const prevFocusedElem = document.activeElement as HTMLElement;
    //     ReactEditor.focus(editor);
    //     ReactEditor.blur(editor);
    //     prevFocusedElem && prevFocusedElem.focus();
    // }, [editor, isFirstRender]);

    // const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    //     console.log('keydown', e);
    //     if (e.key === Key.Enter && !e.shiftKey) {
    //         e.preventDefault();
    //         onSubmit && onSubmit(editor.children);
    //     }

    //     onKeyDown && onKeyDown(e);
    // }, [editor, onKeyDown, onSubmit]);

    // const stopPropagation = (e: React.KeyboardEvent<HTMLDivElement>) => {
    //     // e.stopPropagation();
    //     console.log('stop prop');
    // };

    return (
        <Editable
            className={className}
            placeholder={placeholder}
            name={name}
            suppressContentEditableWarning
            renderElement={renderElement}
            aria-label={label}
            {...rest}
        />
    );
};