import { ReactEditor } from 'slate-react';
import { CustomEditor } from '../../types';



export const getSlateDomNode = (editor: CustomEditor) => {
    try {
        return ReactEditor.toDOMNode(editor, editor);
    } catch (error) {
        return null;
    }
};