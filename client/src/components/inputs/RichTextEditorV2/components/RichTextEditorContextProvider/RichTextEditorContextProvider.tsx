import { FC, PropsWithChildren, useState } from 'react';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoLinkNode } from '@lexical/link';
import { RichTextEmoji } from '../RichTextEmoji';
import { LinkPlugin } from '../LinkPlugin';
import { ControllablePlugin } from '../ControllablePlugin';



const theme = {};

const getInitialState = () => {
    const value = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

    return value;
};

export const RichTextEditorContextProvider: FC<PropsWithChildren> = ({
    children,
}) => {
    const [editorState, setEditorState] = useState(() => getInitialState());

    const initialConfig: InitialConfigType = {
        namespace: 'MyEditor',
        theme,
        editorState,
        nodes: [
            AutoLinkNode,
            RichTextEmoji.Node,
        ],
        onError: console.error,
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <>
                {children}

                <HistoryPlugin/>

                <LinkPlugin/>

                <ControllablePlugin
                    value={editorState}
                    onChange={setEditorState}
                />

                <RichTextEmoji.Plugin/>
            </>
        </LexicalComposer>
    );
};