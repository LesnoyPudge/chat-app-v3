import { FC, PropsWithChildren, createContext } from 'react';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoLinkNode } from '@lexical/link';
import { OverflowNode } from '@lexical/overflow';
import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin';
import { RichTextEmoji } from '../RichTextEmoji';
import { LinkPlugin } from '../LinkPlugin';
import { ControllablePlugin } from '../ControllablePlugin';
import { logger, noop } from '@utils';
import { EditorState } from 'lexical';
import { SubmitPlugin } from '../SubmitPlugin';
import { SizeLimitPlugin } from '../SizeLimitPlugin';



type RichTextEditorContext = {
    label: string;
    name: string;
    placeholder: string;
    maxLength: number;
} & {
    onSubmit: (state: EditorState) => void;
}

type RichTextEditorContextProvider = Pick<
    RichTextEditorContext,
    'label' | 'name' | 'placeholder'
> & Partial<RichTextEditorContext> & PropsWithChildren & {
    value?: string;
    onChange: (value: string) => void;
};

export const RichTextEditorContext = createContext<RichTextEditorContext>(undefined as any);

const getInitialState = () => {
    return '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
};

export const RichTextEditorContextProvider: FC<RichTextEditorContextProvider> = ({
    label,
    name,
    placeholder,
    value = getInitialState(),
    maxLength = 20,
    children,
    onChange,
    onSubmit = noop,
}) => {
    const initialConfig: InitialConfigType = {
        namespace: 'editor',
        editorState: value,
        nodes: [
            AutoLinkNode,
            OverflowNode,
            RichTextEmoji.Node,
        ],
        onError: logger.error,
    };

    const contextValues: RichTextEditorContext = {
        label,
        name,
        placeholder,
        maxLength,
        onSubmit,
    };

    return (
        <RichTextEditorContext.Provider value={contextValues}>
            <LexicalComposer initialConfig={initialConfig}>
                <>
                    {children}

                    <HistoryPlugin/>

                    <CharacterLimitPlugin
                        charset='UTF-8'
                        maxLength={maxLength}
                    />

                    <LinkPlugin/>

                    <ControllablePlugin
                        value={value}
                        onChange={onChange}
                    />

                    <RichTextEmoji.Plugin/>

                    <SubmitPlugin/>

                    <SizeLimitPlugin/>
                </>
            </LexicalComposer>
        </RichTextEditorContext.Provider>
    );
};