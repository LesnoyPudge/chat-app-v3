import { EmojiCode, getEmojiMatch } from '@components';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isParagraphNode, TextNode } from 'lexical';
import { FC, useEffect } from 'react';
import { $createEmojiNode } from './EmojiNode';



export const EmojiPlugin: FC = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerNodeTransform(TextNode, (textNode) => {
            const parent = textNode.getParent();
            if (!parent || !$isParagraphNode(parent)) return;

            const text = textNode.getTextContent();
            const matchObj = getEmojiMatch(text);
            if (!matchObj) return;

            const { match, emoji } = matchObj;

            const code = match[0] as EmojiCode;
            const splittedNodes = textNode.splitText(
                match.index,
                match.index + code.length,
            );

            const emojiCodeNode = splittedNodes.find((node) => node.__text === code);
            if (!emojiCodeNode) return;

            const emojiNode = $createEmojiNode(code, emoji);

            emojiCodeNode.replace(emojiNode);
        });
    }, [editor]);

    return null;
};