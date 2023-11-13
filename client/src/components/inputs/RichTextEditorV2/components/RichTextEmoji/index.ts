import { $createEmojiNode, $isEmojiNode, EmojiNode } from './EmojiNode';
import { EmojiPlugin } from './EmojiPlugin';
import { useEmoji } from './useEmoji';



export const RichTextEmoji = {
    Node: EmojiNode,
    Plugin: EmojiPlugin,
    $createEmojiNode,
    $isEmojiNode,
    useEmoji,
};