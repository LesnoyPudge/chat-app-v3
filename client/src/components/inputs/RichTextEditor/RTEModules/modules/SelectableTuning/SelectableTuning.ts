import { RTEModules, RTETypes } from '@components';
import { Editor, Range, Transforms } from 'slate';



export const SelectableTuning = {
    withSelectableTuning: ({ editor }: RTETypes.Helpers.WithEditor) => {
        const { move, setSelection } = editor;

        editor.move = (options = {}) => {
            if (options.unit) return move(options);

            const selection = editor.selection;
            if (!selection) return move(options);

            const { reverse } = options;

            const currentNodeEntry = Editor.node(editor, selection.focus);

            const isInsideInlineElement = RTEModules.Text.isTextOfInlineElement(
                editor,
                currentNodeEntry,
            );

            if (isInsideInlineElement) {
                const [currentNode] = currentNodeEntry;

                const isAtStart = selection.focus.offset === 0;
                const isAtEnd = selection.focus.offset === currentNode.text.length;

                if (isAtStart || isAtEnd) {
                    options.distance = 2;
                }
            }

            if (!isInsideInlineElement) {
                const nodeEntryToLookAt = (
                    reverse
                        ? Editor.previous
                        : Editor.next
                )(editor, { at: selection.focus, voids: true });

                if (nodeEntryToLookAt) {
                    const isSelectableInline = (
                        RTEModules.Text.isTextOfInlineElement(editor, nodeEntryToLookAt) &&
                        RTEModules.Text.isTextOfSelectableElement(editor, nodeEntryToLookAt)
                    );

                    if (isSelectableInline) {
                        options.distance = 2;
                    }
                }
            }

            options.unit = 'offset';

            return move(options);
        };

        editor.setSelection = (selection) => {
            if (!Range.isRange(selection)) return setSelection(selection);

            const nodeEntry = Editor.node(editor, selection);
            const [node, path] = nodeEntry;

            if (
                RTEModules.Text.isTextOfSelectableElement(editor, nodeEntry) ||
                RTEModules.Utils.isSelectableElement(editor, node)
            ) return setSelection(selection);

            if (RTEModules.Text.isTextOfUnselectableElement(editor, nodeEntry)) {
                const [_, parentPath] = Editor.parent(editor, path);

                const nextEntry = Editor.next(editor, {
                    at: parentPath,
                    match: (mn, mp) => RTEModules.Text.isSimpleText(editor, [mn, mp]),
                }) ?? Editor.last(editor, []);

                // если nextEntry unselectable
                // if (
                //     RTEModules.Text.isTextOfUnselectableElement(editor, nodeEntry) ||
                //     !RTEModules.Utils.isSelectableElement(editor, nodeEntry[0])
                // ) {
                //     // Transforms.insertNodes(
                //     //     editor, 
                //     //     RTEModules.Text.createText(''),
                //     // );

                //     editor.normalizeNode(nextEntry);
                    
                //     const nextNextEntry = Editor.next(editor, {
                //         at: parentPath,
                //         match: (mn, mp) => RTEModules.Text.isSimpleText(editor, [mn, mp]),
                //     }) ?? Editor.last(editor, []);

                //     // Transforms.select(editor, nextNextEntry[1])
                //     return;
                // }

                Transforms.select(editor, nextEntry[1]);
                Transforms.collapse(editor);

                return;
            }

            return setSelection(selection);
        };

        return editor;
    },
};