// import { Conditional, EmojiCode, Memo, Message, Scrollable } from '@components';
// import { PropsWithClassName } from '@types';
// import { FC, RefObject, useEffect, useRef, useState } from 'react';
// import { IMessage } from '@backendTypes';
// import { ChatListItem, ChatMessagePlaceholderList, HelloFromRoom } from './components';
// import { 
//     // useChat, 
//     useChatScroll } from './hooks';
// import { ViewportList } from 'react-viewport-list';
// import { useKeyboardNavigation } from './useKeyboardNavigation';
// import { ChatMock } from './ChatMock';
// import { SimpleBarCore } from '@reExport';
// import { useLatest } from 'react-use';



// type Message = IMessage & {
//     reactions: {
//         code: EmojiCode;
//         users: string[];
//     }[];
// }

// interface Chat extends PropsWithClassName {
//     messages?: Message[];
// }

// export interface VirtualItemRefs {
//     messageWrapperRef: RefObject<HTMLElement>,
//     messageRef: RefObject<HTMLElement>,
// }

// export const chatMock = new ChatMock(150, 20);

// const initialMessages = chatMock.getLastMessagesChunk();

// const styles = {
//     scrollableWrapper: 'flex grow relative',
//     scrollable: 'absolute inset-0 overflow-y-scroll overflow-x-hidden',
//     placeholderList: 'flex flex-col gap-4',
// };

// export const Chat: FC<Chat> = ({
//     className = '',
// }) => {
//     const [messageList, setMessageList] = useState(initialMessages);

//     // const {

//     // } = useChat(messageList);

//     const firstMessageRef = useLatest(messageList.at(0));
//     const [isAtStart, setIsAtStart] = useState(false);
//     const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
//     const virtualItemsRef = useRef<Record<string, VirtualItemRefs>>({});

//     const {
//         setAutoScrollTriggerElement,
//         indexesShift,
//         setContentElement,
//         setContentWrapperElement,
//         setViewportList,
//         setPlaceholder,
//         isPlaceholderVisible,
//         contentWrapperElement,
//         viewportList,
//     } = useChatScroll(messageList);

//     const timeoutRef = useRef(0);

//     useEffect(() => {
//         if (!isPlaceholderVisible) return;
//         if (!firstMessageRef.current) return;
        
//         const earlierMessages = chatMock.getMessagesBeforeTimestamp(firstMessageRef.current.createdAt);

//         console.log('start');

//         timeoutRef.current = setTimeout(() => {  
//             if (earlierMessages.length < 20) {
//                 setIsAtStart(true);
//             }

//             console.log('do');
            
//             setMessageList(prev => [...earlierMessages, ...prev]);
//         }, 3000);

//         return () => {
//             clearTimeout(timeoutRef.current);
//         };
//     }, [firstMessageRef, isPlaceholderVisible]);

//     const isLoading = false;
//     const displayMode = 'cozy' satisfies 'cozy' | 'compact';

//     const showHelloMessage = !isLoading && isAtStart;
//     const showPlaceholder = !!messageList.length && !isAtStart;

//     // const [virtualIndexes, setVirtualIndexes] = useState<[number, number]>([0, messageList.length]);
//     // const virtualList = messageList.slice(virtualIndexes[0], virtualIndexes[1] + 1);
//     const virtualListRef = useRef<Message[]>([]);
//     // const [virtualList, setVvirtualList] = useState<Message[]>([]);

//     const {
//         getIsFocused,
//         setFocusedId,
//     } = useKeyboardNavigation(
//         virtualListRef,
//         contentWrapperElement, 
//         {
//             direction: 'vertical',
//             loop: false,
//             initialFocusableId: messageList.at(-1)?.id,
//             onFocusChange: (item) => {
//                 if (!item) return;

//                 const itemRefs = virtualItemsRef.current[item.id];
//                 if (!itemRefs) return;

//                 itemRefs.messageWrapperRef.current?.scrollIntoView({ block: 'center' });
//             },
//         },
//     );

//     const handleViewportIndexesChange = (indexes: [number, number]) => {
//         const startIndex = Math.max(0, indexes[0] - 1);
//         const endIndex = Math.min(messageList.length, indexes[1] + 1);
//         // const startIndex = Math.max(0, indexes[0]);
//         // const endIndex = Math.min(messageList.length, indexes[1]);

//         virtualListRef.current = messageList.slice(
//             startIndex, 
//             endIndex,
//         );
//     };

//     const addMessage = () => {
//         const [_, newMessage] = chatMock.addNewMessage();
//         setMessageList(prev => [...prev, ...chatMock.getMessagesAfterTimestamp(newMessage.createdAt)]);
//     };

//     const setSimpleBar = (ref: SimpleBarCore | null) => {
//         if (!ref) return;
//         setContentWrapperElement(ref.contentWrapperEl);
//         setContentElement(ref.contentEl);
//     };
    
//     return (
//         <div className={className + ' h-full flex flex-col'}>
//             <button className='shrink-0' onClick={addMessage}>add</button>

//             <Scrollable
//                 setSimpleBar={setSimpleBar}
//                 focusable
//                 label=''
//             >
//                 {/* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/feed_role */}
//                 <div 
//                     role='feed'
//                     aria-busy
//                     aria-label='Сообщения'
//                 >
//                     <Conditional isRendered={isLoading}>
//                         <ChatMessagePlaceholderList/>
//                     </Conditional>

//                     <Conditional isRendered={showHelloMessage}>
//                         <HelloFromRoom/>
//                     </Conditional>
                    
//                     <Conditional isRendered={showPlaceholder}>
//                         <ChatMessagePlaceholderList innerRef={setPlaceholder}/>
//                     </Conditional>

//                     <Conditional isRendered={!!messageList.length}>
//                         <ViewportList
//                             items={messageList}
//                             initialIndex={messageList.length - 1}
//                             withCache
//                             overscan={3}
//                             indexesShift={indexesShift}
//                             initialPrerender={10}
//                             axis='y'
//                             initialAlignToTop={true}
//                             scrollThreshold={0}
//                             ref={setViewportList}
//                             onViewportIndexesChange={handleViewportIndexesChange}
//                         >
//                             {({ id }) => (
//                                 <Memo key={id}>
//                                     <ChatListItem
//                                         id={id}
//                                         isFocused={getIsFocused(id)}
//                                         setFocusedId={setFocusedId}
//                                         virtualItemsRef={virtualItemsRef}
//                                     />
//                                 </Memo>
//                             )}
//                         </ViewportList>
//                     </Conditional>

//                     <div 
//                         className='h-px'
//                         aria-hidden
//                         ref={setAutoScrollTriggerElement}
//                     ></div>
//                 </div>
//             </Scrollable>
//         </div>
//     );
// };

export {};