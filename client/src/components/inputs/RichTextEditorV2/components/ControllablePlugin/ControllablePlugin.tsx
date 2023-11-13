import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FC, useEffect, useRef } from 'react';



type ControllablePlugin = {
    value: string;
    onChange: (value: string) => void;
}

export const ControllablePlugin: FC<ControllablePlugin> = ({
    value,
    onChange,
}) => {
    const [editor] = useLexicalComposerContext();
    const lastStateRef = useRef(JSON.stringify(editor.getEditorState().toJSON()));

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            const stateString = JSON.stringify(editorState.toJSON());
            lastStateRef.current = stateString;
            onChange(stateString);
        });
    }, [editor, onChange]);

    useEffect(() => {
        if (value === lastStateRef.current) return;

        editor.setEditorState(editor.parseEditorState(value));
    }, [editor, value]);

    return null;
};