import { EmojiCode } from '@components';
import { useCallback } from 'react';
import { Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';



export const useSlateAddEmoji = () => {
    const editor = useSlate();

    const addEmoji = useCallback((code: EmojiCode) => {
        ReactEditor.focus(editor);
        Transforms.insertText(editor, code);
    }, [editor]);

    return {
        addEmoji,
    };
};