import { FC, useContext, useEffect } from 'react';
import { RichTextEditorContext } from '../RichTextEditorContextProvider';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $rootTextContent } from '@lexical/text';



export const SizeLimitPlugin: FC = () => {
    const { maxLength } = useContext(RichTextEditorContext);
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const text = editor.getEditorState().read($rootTextContent);
        editor.registerUpdateListener(({ editorState }) => {


            console.log('update');
            return true;
        });
    }, [editor]);

    return null;
};