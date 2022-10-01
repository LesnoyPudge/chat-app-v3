import { useSlate } from 'slate-react';



type EmojiCodes = '';

export const useAddEmoji = () => {
    const editor = useSlate();

    const addEmoji = (code: EmojiCodes) => {
        editor.insertNode({
            type: 'emoji',
            code,
            children: [{ text: '' }],
        });
    };

    return {
        addEmoji,
    };
};