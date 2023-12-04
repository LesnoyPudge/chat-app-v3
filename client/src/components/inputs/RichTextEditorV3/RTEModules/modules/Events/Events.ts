import { isKeyHotkey } from 'is-hotkey';
import { Editor, Transforms } from 'slate';



export const Events = {
    KeyDown: (editor: Editor) => {
        return (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (!editor.selection) return;

            if (isKeyHotkey('shift+left', e.nativeEvent)) {
                e.preventDefault();

                Transforms.move(editor, {
                    reverse: true,
                    edge: 'focus',
                });
            }

            if (isKeyHotkey('shift+right', e.nativeEvent)) {
                e.preventDefault();

                Transforms.move(editor, {
                    reverse: false,
                    edge: 'focus',
                });
            }
        };
    },
};