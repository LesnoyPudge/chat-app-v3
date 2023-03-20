import { IMessage } from '@backendTypes';
import { EmojiCode } from '@components';
import { FC } from 'react';
import { Descendant } from 'slate';
import { MessageControlBar, MessageImages, MessageReactions, MessageRedactor } from '..';



interface MessageAdditions {
    closeEditor: () => void;
    isInEditMode: boolean;
    message: IMessage & {reactions: {code: EmojiCode, users: string[]}[]};
    saveEditor: (value: Descendant[]) => void;
    addReaction: (code: EmojiCode) => void;
}

const styles = {
    gap: 'my-1.5',
};

export const MessageAdditions: FC<MessageAdditions> = ({
    closeEditor,
    isInEditMode,
    message,
    saveEditor,
    addReaction,
}) => {
    return (
        <>
            <MessageRedactor 
                className={styles.gap}
                closeEditor={closeEditor}
                isInEditMode={isInEditMode}
                message={message}
                saveEditor={saveEditor}
            />

            <MessageImages 
                className={styles.gap}
                message={message}
            />
        
            <MessageReactions 
                className={styles.gap}
                addReaction={addReaction}
                message={message}
            />
        </>
    );
};

// const styles = {
//     gap: 'my-1.5',
// };

// export const MessageAdditions: FC = () => {
//     return (
//         <>
//             <MessageRedactor className={styles.gap}/>

//             <MessageImages className={styles.gap}/>
        
//             <MessageReactions className={styles.gap}/>
//         </>
//     );
// };