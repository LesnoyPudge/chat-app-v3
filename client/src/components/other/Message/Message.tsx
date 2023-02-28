import { PropsWithClassName } from '@types';
import { createContext, FC } from 'react';
import { Descendant } from 'slate';
import { EmojiCode, Conditional } from '@components';
import { Heading } from '@libs';
import { twClassNames } from '@utils';
import { CompactMessage, CozyMessage } from './components';
import { IMessage } from '@backendTypes';
import { useToggle } from 'usehooks-ts';



interface MessageComponent extends PropsWithClassName {
    message: IMessage & {reactions: {code: EmojiCode, users: string[]}[]};
    isHeadless: boolean;
    displayMode: 'cozy' | 'compact';
    tabIndex?: number;
}

interface Ids {
    timestampId: string,
    usernameId: string;
    contentId: string;
    editTimestampId: string;
}

export interface MessageContext extends Required<Omit<MessageComponent, 'className' | 'displayMode'>> {
    ids: Ids;
    isInEditMode: boolean;
    handleAddReaction: (code: EmojiCode) => void;
    handleSaveRedactedMessage: (value: Descendant[]) => void;
    toggleIsInEditMode: () => void;
}

const styles = {
    wrapper: `relative mt-14 pr-12 py-1 group bg-primary-200 
    hover:bg-primary-300 focus-within:bg-primary-300`,
    heading: 'sr-only',
};

export const MessageContext = createContext<MessageContext | undefined>(undefined);

export const Message: FC<MessageComponent> = ({
    className = '',
    message,
    displayMode,
    isHeadless,
    tabIndex = 0,
}) => {
    const [isInEditMode, toggleIsInEditMode] = useToggle(false);

    const isCompact = displayMode === 'compact';
    const isCozy = displayMode === 'cozy';

    const ids: Ids = {
        timestampId: `timestampId-${message.id}`,
        usernameId: `usernameId-${message.id}`,
        contentId: `contentId-${message.id}`,
        editTimestampId: `editTimestampId-${message.id}`,
    };

    const handleSaveRedactedMessage = (value: Descendant[]) => {
        console.log('save', value);
        toggleIsInEditMode();
    };

    const handleAddReaction = (code: EmojiCode) => {
        console.log('add reaction', code);
    };

    const contextValues: MessageContext = {
        isHeadless,
        message,
        tabIndex,
        ids,
        isInEditMode,
        handleSaveRedactedMessage,
        handleAddReaction,
        toggleIsInEditMode,
    };

    return (
        <MessageContext.Provider value={contextValues}>
            <article 
                className={twClassNames(styles.wrapper, className)}
                aria-labelledby={`${ids.timestampId} ${ids.usernameId} ${ids.contentId} ${ids.editTimestampId}`}
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
            </article>
        </MessageContext.Provider>
    );
};