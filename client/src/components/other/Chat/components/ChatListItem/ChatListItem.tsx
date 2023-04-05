// import { IMessage } from '@backendTypes';
// import { Conditional, EmojiCode, Message } from '@components';
// import { twClassNames } from '@utils';
// import { isSameDay, differenceInMinutes } from 'date-fns';
// import { FC, RefObject } from 'react';
// import { MoveFocusInside } from 'react-focus-lock';
// import { DayDivider } from '../DayDivider';



// type Message = IMessage & {
//     reactions: {
//         code: EmojiCode;
//         users: string[];
//     }[];
// }

// interface ChatListItem {
//     listRef: RefObject<Message[]>;
//     id: string;
// }

// export const ChatListItem: FC<ChatListItem> = ({
//     listRef,
//     id,
// }) => {
//     const messageList = listRef.current;
//     if (!messageList || !messageList.length) return;
    
//     const message = messageList.find(item => item.id === id);
//     if (!message) return;

//     const isFirst = message.id === messageList[0].id;
//     const currentMessageIndex = messageList.findIndex((item) => item.id === message.id);
                                    
//     const previousMessage = (
//         currentMessageIndex > 0
//             ? messageList[currentMessageIndex - 1]
//             : null
//     );
                                    
//     const isPreviousUserSameAsCurrent = (
//         previousMessage 
//             ? previousMessage.user === message.user
//             : false
//     );
                                    
//     const isNewDay = (
//         previousMessage
//             ? !isSameDay(
//                 previousMessage.createdAt, 
//                 message.createdAt,
//             )
//             : true
//     );
                                    
//     const withTimeGap = (
//         previousMessage
//             ? differenceInMinutes(
//                 previousMessage.createdAt, 
//                 message.createdAt,
//             ) >= 5
//             : false
//     );
                                    
//     const isGroupHead = isFirst || isPreviousUserSameAsCurrent || withTimeGap || isNewDay;
//     const showDayDivider = isNewDay && !(isAtStart && isFirst);
                                    
//     return (
//         <MoveFocusInside 
//             disabled={!getIsFocused(message.id) || true}
//             key={message.id}
//         >
//             <div key={message.id}>
//                 <Conditional isRendered={showDayDivider}>
//                     <DayDivider time={message.createdAt}/>
//                 </Conditional>
                                        
                                                
//                 <div 
//                     className={twClassNames({
//                         [styles.messageGroupHead]: isGroupHead,
//                     })}
//                     aria-hidden
//                 >
//                     <Message
//                         message={message}
//                         displayMode={displayMode}
//                         isGroupHead={isGroupHead}
//                         tabIndex={getTabIndex(message.id)}
//                         onClick={() => setFocusedId(message.id)}
//                         isInEditMode={!!editingMessageId && editingMessageId === message.id}
//                         addReaction={(code) => console.log('add reaction', code)}
//                         closeEditor={() => setEditingMessageId(null)}
//                         openEditor={() => setEditingMessageId(message.id)}
//                         saveEditor={(value) => {
//                             setEditingMessageId(null);
//                             console.log('save editor', value);
//                         }}
//                     />
//                 </div>
//             </div>
//         </MoveFocusInside>
//     );
// };


export {};