import { useCallback } from 'react';
import { Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { EmojiCodeType } from '../../components';



export const useAddEmoji = () => {
    const editor = useSlate();

    const addEmoji = useCallback((code: EmojiCodeType) => {
        ReactEditor.focus(editor);
        Transforms.insertText(editor, code);
    }, [editor]);

    return {
        addEmoji,
    };
};