import { useEffect, useRef } from 'react';
import { CustomEditor } from '@libs';
import { ReactEditor } from 'slate-react';



export const useGetSlateEditorElementRef = (editor: CustomEditor) => {
    const editorRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        editorRef.current = ReactEditor.toDOMNode(editor, editor);
    }, [editor]);

    return editorRef;
};