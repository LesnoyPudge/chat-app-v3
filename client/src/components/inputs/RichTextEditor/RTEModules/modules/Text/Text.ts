import { RTEModules, RTETypes } from '@components';
import { Editor, Element, NodeEntry, Text as SlateText } from 'slate';
import { StrictOmit } from 'ts-essentials';



export const Text = {
    createText: <T extends string>(
        text: T,
        options: Partial<StrictOmit<RTETypes.Text, 'text'>> = {},
    ): RTETypes.Text<T> => {
        return {
            text,
            ...options,
        };
    },

    isSimpleText: (
        editor: Editor,
        nodeEntry: NodeEntry,
    ): nodeEntry is NodeEntry<RTETypes.Text> => {
        return (
            SlateText.isText(nodeEntry[0]) &&
            RTEModules.Paragraph.isParagraph(
                Editor.parent(editor, nodeEntry[1])[0],
            )
        );
    },

    isEmpty: (node: RTETypes.Text): node is RTETypes.Text<''> => {
        return node.text === '';
    },

    isEmptySimpleText: (
        editor: Editor,
        nodeEntry: NodeEntry,
    ): nodeEntry is NodeEntry<RTETypes.Text<''>> => {
        return (
            RTEModules.Text.isSimpleText(editor, nodeEntry) &&
            RTEModules.Text.isEmpty(nodeEntry[0])
        );
    },

    isNotEmptySimpleText: (
        editor: Editor,
        nodeEntry: NodeEntry,
    ): nodeEntry is NodeEntry<RTETypes.Text> => {
        return (
            RTEModules.Text.isSimpleText(editor, nodeEntry) &&
            !RTEModules.Text.isEmpty(nodeEntry[0])
        );
    },

    isEditableElementText: (
        editor: Editor,
        nodeEntry: NodeEntry,
    ): nodeEntry is NodeEntry<RTETypes.Text> => {
        if (!SlateText.isText(nodeEntry[0])) return false;

        const parent = Editor.parent(editor, nodeEntry[1])[0];

        if (!Element.isElement(parent)) return false;

        return !Editor.isElementReadOnly(editor, parent);
    },

    isReadOnlyElementText: (
        editor: Editor,
        nodeEntry: NodeEntry,
    ): nodeEntry is NodeEntry<RTETypes.Text> => {
        if (!SlateText.isText(nodeEntry[0])) return false;

        const parent = Editor.parent(editor, nodeEntry[1])[0];

        if (!Element.isElement(parent)) return false;

        return Editor.isElementReadOnly(editor, parent);
    },

    isTextOfSelectableElement: (
        editor: Editor,
        nodeEntry: NodeEntry,
    ): nodeEntry is NodeEntry<RTETypes.Text> => {
        if (!SlateText.isText(nodeEntry[0])) return false;

        const [parent] = Editor.parent(editor, nodeEntry[1]);

        if (!Element.isElement(parent)) return false;

        return Editor.isSelectable(editor, parent);
    },

    isTextOfUnselectableElement: (
        editor: Editor,
        nodeEntry: NodeEntry,
    ): nodeEntry is NodeEntry<RTETypes.Text> => {
        if (!SlateText.isText(nodeEntry[0])) return false;

        const [parent] = Editor.parent(editor, nodeEntry[1]);

        if (!Element.isElement(parent)) return false;

        return !Editor.isSelectable(editor, parent);
    },

    isTextOfInlineElement: (
        editor: Editor,
        nodeEntry: NodeEntry,
    ): nodeEntry is NodeEntry<RTETypes.Text> => {
        if (!SlateText.isText(nodeEntry[0])) return false;

        const [parent] = Editor.parent(editor, nodeEntry[1]);

        if (!Element.isElement(parent)) return false;

        return Editor.isInline(editor, parent);
    },

    isSpacerText: (
        editor: Editor,
        nodeEntry: NodeEntry,
    ): nodeEntry is NodeEntry<RTETypes.Text> => {
        const [node, path] = nodeEntry;

        if (!SlateText.isText(node)) return false;
        if (node.text !== '') return false;

        const prevEntry = Editor.previous(editor, { at: path, voids: true });
        const nextEntry = Editor.next(editor, { at: path, voids: true });

        if (!prevEntry && !nextEntry) return false;

        const entry = prevEntry ?? nextEntry;
        if (!entry) return false;


        const isInline = (
            RTEModules.Utils.isInlineElement(editor, entry[0]) ||
            RTEModules.Text.isTextOfInlineElement(editor, entry)
        );

        return isInline;
    },
};