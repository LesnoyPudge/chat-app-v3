import { noop } from '@utils';
import { isKeyHotkey } from 'is-hotkey';
import { Descendant, Editor, Transforms } from 'slate';



const isSelectLeftHotkey = isKeyHotkey('shift+left');
const isSelectRightHotkey = isKeyHotkey('shift+right');
const isSubmitHotkey = isKeyHotkey('enter');

export const Events = {
    KeyDown: (
        editor: Editor,
        onSubmit: (value: Descendant[]) => void = noop,
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

                onSubmit(editor.children);

                return;
            }
        };
    },
};