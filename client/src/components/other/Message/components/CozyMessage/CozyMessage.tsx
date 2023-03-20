import { FC, useContext } from 'react';
import { Button, Conditional, EmojiCode, UserAvatar, UserName } from '@components';
import { Ids, MessageContext } from '../../Message';
import { MessageAdditions, MessageContent, MessageCozyTimestamp, MessageTimestamp } from '..';
import { IMessage } from '@backendTypes';
import { Descendant } from 'slate';



interface CozyMessage {
    message: IMessage & {
        reactions: {
            code: EmojiCode;
            users: string[];
        }[];
    };
    isGroupHead: boolean;
    ids: Ids;
    isInEditMode: boolean;
    addReaction: (code: EmojiCode) => void;
    closeEditor: () => void;
    saveEditor: (value: Descendant[]) => void;
}

const styles = {
    wrapper: 'flex',
    firstCol: 'flex justify-end items-start shrink-0 w-[72px] pr-4',
    avatar: 'w-10 h-10',
    headlessCreationTimestamp: `text-xs leading-none text-color-muted font-medium opacity-0
    group-hover:opacity-100 group-focus-within:opacity-100`,
    secondCol: 'w-full',
    infoRow: 'flex gap-2',
    contentRow: '',
    username: 'font-medium text-color-primary underline-offset-4 focus-visible:underline hover:underline',
};

export const CozyMessage: FC<CozyMessage> = ({
    ids,
    isGroupHead,
    isInEditMode,
    message,
    addReaction,
    closeEditor,
    saveEditor,
}) => {
    const user = {
        id: message.user,
        name: 'loshok111',
        avatar: 'https://i.pravatar.cc/80',
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.firstCol}>
                <Conditional isRendered={isGroupHead}>
                    <UserAvatar
                        className={styles.avatar}
                        avatar={user.avatar}
                        username={user.name}
                    />
                </Conditional>

                <Conditional isRendered={!isGroupHead}>
                    <div>
                        <MessageTimestamp 
                            className={styles.headlessCreationTimestamp}
                            ids={ids}
                            message={message}
                        />
                    </div>
                </Conditional>
            </div>

            <div className={styles.secondCol}>
                <Conditional isRendered={isGroupHead}>
                    <div className={styles.infoRow}>
                        <Button
                            label=''
                            hasPopup='menu'
                            isActive={false}
                            onLeftClick={() => console.log('open menu')}
                        >
                            <UserName className={styles.username}/>
                        </Button>

                        <MessageCozyTimestamp
                            ids={ids}
                            message={message}
                        />
                    </div> 
                </Conditional>
                
                <MessageContent
                    ids={ids}
                    isInEditMode={isInEditMode}
                    message={message}
                />

                <MessageAdditions
                    addReaction={addReaction}
                    closeEditor={closeEditor}
                    isInEditMode={isInEditMode}
                    message={message}
                    saveEditor={saveEditor}
                />
            </div>
        </div>
    );
};

// const styles = {
//     wrapper: 'flex',
//     firstCol: 'flex justify-end items-start shrink-0 w-[72px] pr-4',
//     avatar: 'w-10 h-10',
//     headlessCreationTimestamp: `text-xs leading-none text-color-muted font-medium opacity-0
//     group-hover:opacity-100 group-focus-within:opacity-100`,
//     secondCol: 'w-full',
//     infoRow: 'flex gap-2',
//     contentRow: '',
//     username: 'font-medium text-color-primary underline-offset-4 focus-visible:underline hover:underline',
// };

// export const CozyMessage: FC = () => {
//     const { message, isGroupHead } = useContext(MessageContext) as MessageContext;
    
//     const user = {
//         id: message.user,
//         name: 'loshok111',
//         avatar: 'https://i.pravatar.cc/80',
//     };

//     return (
//         <div className={styles.wrapper}>
//             <div className={styles.firstCol}>
//                 <Conditional isRendered={isGroupHead}>
//                     <UserAvatar
//                         className={styles.avatar}
//                         avatar={user.avatar}
//                         username={user.name}
//                     />
//                 </Conditional>

//                 <Conditional isRendered={!isGroupHead}>
//                     <div>
//                         <MessageTimestamp className={styles.headlessCreationTimestamp}/>
//                     </div>
//                 </Conditional>
//             </div>

//             <div className={styles.secondCol}>
//                 <Conditional isRendered={isGroupHead}>
//                     <div className={styles.infoRow}>
//                         <Button
//                             label=''
//                             hasPopup='menu'
//                             isActive={false}
//                             onLeftClick={() => console.log('open menu')}
//                         >
//                             <UserName className={styles.username}/>
//                         </Button>

//                         <MessageCozyTimestamp/>
//                     </div> 
//                 </Conditional>
                
//                 <MessageContent/>

//                 <MessageAdditions/>
//             </div>
//         </div>
//     );
// };