import { useCallback } from 'react';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { EmojiCodeType } from '../../components';



export const useAddEmoji = () => {
    const editor = useSlate();

    const addEmoji = useCallback((code: EmojiCodeType) => {
        Transforms.insertText(editor, code);
    }, [editor]);

    return {
        addEmoji,
    };
};