import { Descendant, Editor, Element, Node, createEditor } from 'slate';
import { RTEModules, RTETypes } from '@components';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';



type EditorCreatorOptions = {
    characterLimit: RTETypes.Plugins.WithCharacterLimit;
};

export const Utils = {
    isSelectableElement: (editor: Editor, node: Node): node is Element => {
        return Element.isElement(node) && Editor.isSelectable(editor, node);
    },

    isInlineElement: (editor: Editor, node: Node): node is Element => {
        return Element.isElement(node) && Editor.isInline(editor, node);
    },

    isBlockElement: (editor: Editor, node: Node): node is Element => {
        return Element.isElement(node) && Editor.isBlock(editor, node);
    },

    createEditorWithPlugins: ({
        characterLimit,
    }: EditorCreatorOptions) => {
        let editor = createEditor();

        editor = withHistory(editor);
        editor = withReact(editor);
        editor = RTEModules.Paragraph.withParagraph({ editor });
        editor = RTEModules.Emoji.withEmoji({ editor });
        editor = RTEModules.Link.withLink({ editor });
        editor = RTEModules.CharacterLimit.withCharacterLimit({ editor, ...characterLimit });
        editor = RTEModules.SelectableTuning.withSelectableTuning({ editor });
        editor = RTEModules.Dev.withDevWindow({ editor });

        return editor;
    },

    createInitialValue: (text = ''): Descendant[] => {
        return [
            RTEModules.Paragraph.createParagraph([
                RTEModules.Text.createText(text),
            ]),
        ];
    },
};