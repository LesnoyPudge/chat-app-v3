import { Descendant, Editor, Element, Node, Transforms, createEditor } from 'slate';
import { RTEModules, RTETypes } from '@components';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { Text } from 'slate';
import { tryParseJSON } from '@utils';



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

    createInitialValue: (text = ''): RTETypes.Nodes => {
        return [
            RTEModules.Paragraph.createParagraph([
                RTEModules.Text.createText(text),
            ]),
        ];
    },

    resetEditor: (
        editor: RTETypes.Editor,
        initialValue: RTETypes.Nodes,
    ) => {
        editor.children = initialValue;
        editor.history.redos = [];
        editor.history.undos = [];
        // editor.onChange();

        Editor.normalize(editor, { force: true });
        Transforms.select(editor, Editor.end(editor, []));
    },

    isEditorEmpty: (value: RTETypes.Nodes): boolean => {
        const isEmpty = value.some((node) => {
            if (
                Element.isElement(node) 
                && !Utils.isEditorEmpty(node.children)
            ) {
                return false;
            }

            if (Text.isText(node) && node.text.trim() !== '') {
                return false;
            }
        
            return true;
        })

        
        return isEmpty;
    },

    isEditorValue: (value: unknown): value is RTETypes.Nodes => {
        return Node.isNodeList(value);
    },

    parse: (value: string): RTETypes.Nodes => {
        const parsed = tryParseJSON<RTETypes.Nodes>(value);
        
        if (!Utils.isEditorValue(parsed)) {
            return Utils.createInitialValue();
        }

        return parsed;
    },
};