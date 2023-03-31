import { PropsWithClassName } from '@types';
import { createContext, FC } from 'react';
import { Descendant } from 'slate';
import { EmojiCode, Conditional } from '@components';
import { Heading, isDescendantEmpty } from '@libs';
import { twClassNames } from '@utils';
import { CompactMessage, CozyMessage, MessageControlBar } from './components';
import { IMessage } from '@backendTypes';
import { useToggle } from 'usehooks-ts';

// isInEditMode: (messageId: string) => boolean;
//     openEditor: () => void;
//     closeEditor: () => void;
//     saveEditor: () => void;


interface MessageComponent extends PropsWithClassName {
    message: IMessage & {reactions: {code: EmojiCode, users: string[]}[]};
    isGroupHead: boolean;
    displayMode: 'cozy' | 'compact';
    tabIndex?: number;
    isInEditMode: boolean;
    openEditor: () => void;
    closeEditor: () => void;
    saveEditor: (value: Descendant[]) => void;
    addReaction: (code: EmojiCode) => void;
}

export interface Ids {
    timestampId: string,
    usernameId: string;
    contentId: string;
    editTimestampId: string;
}

// export interface MessageContext extends Required<Omit<MessageComponent, 'className' | 'displayMode'>> {
//     ids: Ids;
//     isInEditMode: boolean;
//     handleAddReaction: (code: EmojiCode) => void;
//     handleSaveRedactedMessage: (value: Descendant[]) => void;
//     toggleIsInEditMode: () => void;
// }

const styles = {
    wrapper: `group relative pr-12 py-1 bg-primary-200 
    hover:bg-primary-300 focus-within:bg-primary-300`,
    heading: 'sr-only',
};

export const MessageContext = createContext<undefined>(undefined);

export const Message: FC<MessageComponent> = ({
    className = '',
    message,
    displayMode,
    isGroupHead,
    tabIndex = 0,
    isInEditMode,
    addReaction,
    openEditor,
    closeEditor,
    saveEditor,
}) => {
    const isCompact = displayMode === 'compact';
    const isCozy = displayMode === 'cozy';

    const ids: Ids = {
        timestampId: `timestampId-${message.id}`,
        usernameId: `usernameId-${message.id}`,
        contentId: `contentId-${message.id}`,
        editTimestampId: `editTimestampId-${message.id}`,
    };

    return (
        <article 
            className={twClassNames(styles.wrapper, className)}
            aria-labelledby={`${ids.timestampId} ${ids.usernameId} ${ids.contentId} ${ids.editTimestampId}`}
            aria-hidden={false}
            aria-setsize={-1}
        >
            <Heading 
                className={styles.heading} 
                aria-labelledby={`${ids.timestampId} ${ids.usernameId}`}
            />
        
            <Conditional isRendered={isCompact}>
                <CompactMessage
                    addReaction={addReaction}
                    closeEditor={closeEditor}
                    ids={ids}
                    isGroupHead={isGroupHead}
                    isInEditMode={isInEditMode}
                    message={message}
                    saveEditor={saveEditor}
                    tabIndex={tabIndex}
                />
            </Conditional>

            <Conditional isRendered={isCozy}>
                <CozyMessage
                    ids={ids}
                    isGroupHead={isGroupHead}
                    isInEditMode={isInEditMode}
                    message={message}
                    addReaction={addReaction}
                    closeEditor={closeEditor}
                    saveEditor={saveEditor}
                />
            </Conditional>

            <Conditional isRendered={!isInEditMode}>
                <MessageControlBar
                    addReaction={addReaction}
                    tabIndex={tabIndex}
                    openEditor={openEditor}
                />
            </Conditional>
        </article>
    );
};







// interface MessageComponent extends PropsWithClassName {
//     message: IMessage & {reactions: {code: EmojiCode, users: string[]}[]};
//     isGroupHead: boolean;
//     displayMode: 'cozy' | 'compact';
//     tabIndex?: number;
// }

// interface Ids {
//     timestampId: string,
//     usernameId: string;
//     contentId: string;
//     editTimestampId: string;
// }

// export interface MessageContext extends Required<Omit<MessageComponent, 'className' | 'displayMode'>> {
//     ids: Ids;
//     isInEditMode: boolean;
//     handleAddReaction: (code: EmojiCode) => void;
//     handleSaveRedactedMessage: (value: Descendant[]) => void;
//     toggleIsInEditMode: () => void;
// }

// const styles = {
//     wrapper: `group relative pr-12 py-1 bg-primary-200 
//     hover:bg-primary-300 focus-within:bg-primary-300`,
//     heading: 'sr-only',
// };

// export const MessageContext = createContext<MessageContext | undefined>(undefined);

// export const Message: FC<MessageComponent> = ({
//     className = '',
//     message,
//     displayMode,
//     isGroupHead,
//     tabIndex = 0,
// }) => {
//     const [isInEditMode, toggleIsInEditMode] = useToggle(false);

//     const isCompact = displayMode === 'compact';
//     const isCozy = displayMode === 'cozy';

//     const ids: Ids = {
//         timestampId: `timestampId-${message.id}`,
//         usernameId: `usernameId-${message.id}`,
//         contentId: `contentId-${message.id}`,
//         editTimestampId: `editTimestampId-${message.id}`,
//     };

//     const handleSaveRedactedMessage = (value: Descendant[]) => {
//         console.log(`save, isEmpty: ${isDescendantEmpty(value)}`, value);
//         toggleIsInEditMode();
//     };

//     const handleAddReaction = (code: EmojiCode) => {
//         console.log('add reaction', code);
//     };

//     const contextValues: MessageContext = {
//         isGroupHead,
//         message,
//         tabIndex,
//         ids,
//         isInEditMode,
//         handleSaveRedactedMessage,
//         handleAddReaction,
//         toggleIsInEditMode,
//     };

//     return (
//         <MessageContext.Provider value={contextValues}>
//             <article 
//                 className={twClassNames(styles.wrapper, className)}
//                 aria-labelledby={`${ids.timestampId} ${ids.usernameId} ${ids.contentId} ${ids.editTimestampId}`}
//             >
//                 <Heading 
//                     className={styles.heading} 
//                     aria-labelledby={`${ids.timestampId} ${ids.usernameId}`}
//                 />
        
//                 <Conditional isRendered={isCompact}>
//                     <CompactMessage/>
//                 </Conditional>

//                 <Conditional isRendered={isCozy}>
//                     <CozyMessage/>
//                 </Conditional>

//                 <Conditional isRendered={!isInEditMode}>
//                     <MessageControlBar/>
//                 </Conditional>
//             </article>
//         </MessageContext.Provider>
//     );
// };