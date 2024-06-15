import { EmojiCode, RTEModules, RTETypes, emojiRegExp } from '@components';
import { useCallback, useContext } from 'react';
import { Element, Node, Transforms } from 'slate';
import { useSlate } from 'slate-react';



export const Emoji = {
    createEmoji: <T extends EmojiCode>(code: T): RTETypes.Elements.Emoji<T> => {
        return {
            type: 'emoji',
            code,
            children: [
                RTEModules.Text.createText(code),
            ],
        };
    },

    isEmoji: (node: unknown): node is RTETypes.Elements.Emoji => {
        return Element.isElement(node) && node.type === 'emoji';
    },

    getEmojiMatch: (text: string) => {
        text = text.toLowerCase();

        const match = text.match(emojiRegExp);
        const noMatch = !match || !match.length;
        if (noMatch) return null;

        const emojiCode = match[0] as EmojiCode;

        const matchStart = text.indexOf(emojiCode);
        const matchEnd = matchStart + emojiCode.length;

        return {
            emojiCode,
            matchStart,
            matchEnd,
        };
    },

    withEmoji: ({ editor }: RTETypes.Helpers.WithEditor) => {
        const {
            isInline, isElementReadOnly, isSelectable,
            isVoid, normalizeNode,
        } = editor;

        editor.isInline = (element) => {
            return Emoji.isEmoji(element) || isInline(element);
        };

        editor.isElementReadOnly = (element) => {
            return Emoji.isEmoji(element) || isElementReadOnly(element);
        };

        editor.isSelectable = (element) => {
            return Emoji.isEmoji(element) ? false : isSelectable(element);
        };

        editor.isVoid = (element) => {
            return Emoji.isEmoji(element) || isVoid(element);
        };

        editor.normalizeNode = (...args) => {
            const [entry] = args;

            if (!RTEModules.Text.isSimpleText(editor, entry)) return normalizeNode(...args);

            const [node, path] = entry;

            const match = Emoji.getEmojiMatch(node.text);
            if (!match) return normalizeNode(...args);
            
            Transforms.wrapNodes(
                editor,
                Emoji.createEmoji(match.emojiCode),
                {
                    at: {
                        anchor: {
                            path,
                            offset: match.matchStart,
                        },
                        focus: {
                            path,
                            offset: match.matchEnd,
                        },
                    },
                    split: true,
                },
            );

            return;
            // return normalizeNode(...args);
        };

        return editor;
    },

    insertEmoji: (editor: RTETypes.Editor, code: EmojiCode) => {
        console.log(editor.selection)
        Transforms.insertText(editor, code);
        // editor.onChange()
        editor.select(editor.selection ?? editor.end([]));
        // editor.normalize
        // Transforms.insertNodes(editor, [
        //     Emoji.createEmoji(code),
        //     RTEModules.Text.createText(''),
        // ])
        
        // editor.normalize()
        
        // editor.normalize({force: true});
        // editor.onChange()
    },

    useInsertEmoji: () => {
        const editor = useSlate();
        
        const insert = useCallback((code: EmojiCode) => {
            Emoji.insertEmoji(editor, code);
        }, [editor]);

        return {
            insert,
        };
    },
};