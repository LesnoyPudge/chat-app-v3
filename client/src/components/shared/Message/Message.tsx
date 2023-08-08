import { PropsWithClassName, PropsWithInnerRef } from '@types';
import { createContext, FC } from 'react';
import { Descendant } from 'slate';
import { EmojiCode, Conditional } from '@components';
import { Heading } from '@libs';
import { twClassNames } from '@utils';
import { CompactMessage, CozyMessage, MessageControlBar } from './components';
import { IMessage } from '@backendTypes';



export interface Ids {
    timestampId: string,
    usernameId: string;
    contentId: string;
    editTimestampId: string;
}

interface SharedProps {
    message: IMessage & {reactions: {code: EmojiCode, users: string[]}[]};
    isGroupHead: boolean;
    tabIndex?: number;
    isInRedactorMode: boolean;
}

export interface MessageComponent extends PropsWithClassName,
PropsWithInnerRef<HTMLElement>,
SharedProps {
    displayMode: 'cozy' | 'compact';
    openEditor: (id: string) => void;
    closeEditor: () => void;
    saveEditor: (id: string, value: Descendant[]) => void;
    addReaction: (id: string, code: EmojiCode) => void;
}

export interface MessageContext extends Required<SharedProps> {
    ids: Ids;
    handleOpenEditor: () => void;
    handleCloseEditor: () => void;
    handleSaveEditor: (value: Descendant[]) => void;
    handleAddReaction: (code: EmojiCode) => void;
}

export const MessageContext = createContext(undefined as unknown as MessageContext);

const styles = {
    wrapper: `group relative bg-primary-200 
    hover:bg-primary-300 focus-within:bg-primary-300`,
    heading: 'sr-only',
};

export const Message: FC<MessageComponent> = ({
    className = '',
    message,
    displayMode,
    isGroupHead,
    tabIndex = -1,
    innerRef,
    isInRedactorMode,
    addReaction,
    openEditor,
    saveEditor,
    closeEditor,
}) => {
    const isCompact = displayMode === 'compact';
    const isCozy = displayMode === 'cozy';

    const ids: Ids = {
        timestampId: `timestampId-${message.id}`,
        usernameId: `usernameId-${message.id}`,
        contentId: `contentId-${message.id}`,
        editTimestampId: `editTimestampId-${message.id}`,
    };

    const contextValues: MessageContext = {
        ids,
        isGroupHead,
        message,
        tabIndex,
        isInRedactorMode,
        handleOpenEditor: () => openEditor(message.id),
        handleCloseEditor: closeEditor,
        handleAddReaction: (code) => addReaction(message.id, code),
        handleSaveEditor: (value) => saveEditor(message.id, value),
    };

    return (
        <MessageContext.Provider value={contextValues}>
            <article
                className={twClassNames(styles.wrapper, className)}
                aria-hidden={false}
                aria-setsize={-1}
                tabIndex={tabIndex}
                aria-labelledby={`${ids.timestampId} ${ids.usernameId} ${ids.contentId} ${ids.editTimestampId}`}
                ref={innerRef}
            >
                <Heading
                    className={styles.heading}
                    aria-labelledby={`${ids.timestampId} ${ids.usernameId}`}
                />

                <Conditional isRendered={isCompact}>
                    <CompactMessage/>
                </Conditional>

                <Conditional isRendered={isCozy}>
                    <CozyMessage/>
                </Conditional>

                <Conditional isRendered={!isInRedactorMode}>
                    <MessageControlBar/>
                </Conditional>
            </article>
        </MessageContext.Provider>
    );
};