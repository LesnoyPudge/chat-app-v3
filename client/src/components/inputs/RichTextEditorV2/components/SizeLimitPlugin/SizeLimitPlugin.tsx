import { FC, useContext, useEffect } from 'react';
import { RichTextEditorContext } from '../RichTextEditorContextProvider';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $rootTextContent } from '@lexical/text';



export const SizeLimitPlugin: FC = () => {
    const { maxLength } = useContext(RichTextEditorContext);
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        let text = editor.getEditorState().read($rootTextContent);

        editor.registerTextContentListener((newText) => {
            text = newText;
        });

        // editor.registerRootListener((root) => {
        //     if (!root) {
        //         console.log('no root', root);
        //         return;
        //     }

        //     (root as HTMLInputElement).addEventListener('beforeinput', (e) => {
        //         console.log('input', e);
        //     });

        //     (root as HTMLInputElement).addEventListener('paste', (e) => {
        //         console.log('paste', e);
        //     });
        // });
    }, [editor]);

    return null;
};