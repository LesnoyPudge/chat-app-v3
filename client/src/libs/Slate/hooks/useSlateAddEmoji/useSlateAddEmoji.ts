import { EmojiCode } from '@components';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';



export const useSlateAddEmoji = () => {
    const editor = useSlate();

    const addEmoji = (code: EmojiCode) => {
        Transforms.insertText(editor, code);
    };

    return {
        addEmoji,
    };
};