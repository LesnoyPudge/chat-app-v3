import { FC, useContext, useEffect } from 'react';
import { KEY_ENTER_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { RichTextEditorContext } from '../RichTextEditorContextProvider';



export const SubmitPlugin: FC = () => {
    const [editor] = useLexicalComposerContext();
    const { onSubmit } = useContext(RichTextEditorContext);

    useEffect(() => {
        return editor.registerCommand(KEY_ENTER_COMMAND, (e: KeyboardEvent) => {
            if (e.shiftKey) return false;

            onSubmit(editor.getEditorState());

            return true;
        }, COMMAND_PRIORITY_LOW);
    }, [editor, onSubmit]);

    return null;
};