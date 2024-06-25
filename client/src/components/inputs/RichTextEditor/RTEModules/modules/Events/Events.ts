import { noop } from '@utils';
import { Transforms } from 'slate';
import { RTETypes } from '@components';
import { ReactEditor } from 'slate-react';
import { KEY, hotKey } from '@lesnoypudge/utils';



// const isSelectLeftHotkey = isKeyHotkey('shift+left');
// const isSelectRightHotkey = isKeyHotkey('shift+right');
// const isSubmitHotkey = isKeyHotkey('enter');
// const isDeleteBackwardHotkey = isKeyHotkey(KEY.Backspace);


const isSelectLeftHotkey = hotKey.matcher([KEY.Shift, KEY.ArrowLeft]);
const isSelectRightHotkey = hotKey.matcher([KEY.Shift, KEY.ArrowRight]);
const isSubmitHotkey = hotKey.matcher([KEY.Enter]);
const isDeleteBackwardHotkey = hotKey.matcher([KEY.Backspace]);

export const Events = {
    KeyDown: (
        editor: RTETypes.Editor,
        onSubmit: (value: RTETypes.Nodes, editor: RTETypes.Editor) => void = noop,
    ) => {
        return (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (!editor.selection) return;

            if (isSelectLeftHotkey(e.nativeEvent)) {
                e.preventDefault();

                Transforms.move(editor, {
                    reverse: true,
                    edge: 'focus',
                });

                return;
            }

            if (isSelectRightHotkey(e.nativeEvent)) {
                e.preventDefault();

                Transforms.move(editor, {
                    reverse: false,
                    edge: 'focus',
                });

                return;
            }

            if (isSubmitHotkey(e.nativeEvent)) {
                e.preventDefault();

                onSubmit(editor.children, editor);

                return;
            }

            if (isDeleteBackwardHotkey(e.nativeEvent)) {
                e.preventDefault()

                // 'manual delete for android'
                Transforms.delete(editor, {
                    reverse: true,
                    distance: 1,
                    at: editor.selection,
                })

                return;
            }
        };
    },

    // selection restoration for slate-react/editable.jsx:202 onDOMSelectionChange
    Focus: (editor: RTETypes.Editor) => {
        return () => {
            if (!editor.selection) return;

            const docSelection = window.getSelection();
            if (!docSelection) return;

            const anchorOffset = editor.selection.anchor.offset;
            const focusOffset = editor.selection.focus.offset;
            const anchorNode = ReactEditor.toDOMPoint(
                editor, 
                editor.selection!.anchor
            )[0];
            const focusNode = ReactEditor.toDOMPoint(
                editor,
                editor.selection!.focus
            )[0]

            docSelection.setBaseAndExtent(
                anchorNode,
                anchorOffset,
                focusNode,
                focusOffset,
            )
        }
    }
};