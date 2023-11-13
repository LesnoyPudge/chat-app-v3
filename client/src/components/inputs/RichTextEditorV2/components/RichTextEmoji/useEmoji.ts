import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createEmojiNode } from './EmojiNode';
import { EmojiCode, emojiList } from '@components';
import { useCallback } from 'react';
import { $insertNodes } from 'lexical';



export const useEmoji = () => {
    const [editor] = useLexicalComposerContext();

    const add = useCallback((code: EmojiCode) => {
        editor.update(() => {
            $insertNodes([$createEmojiNode(
                code,
                emojiList.find((item) => item.code.includes(code)) ?? emojiList[0],
            )]);
        });
    }, [editor]);

    return add;
};