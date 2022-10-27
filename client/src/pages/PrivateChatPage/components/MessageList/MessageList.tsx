import { IMessage } from '@backendTypes';
// import { useIsFirstRender, useWindowSize } from '@hooks';
// import { createContext, FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
// import { VariableSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Scrollbars from 'react-custom-scrollbars-2';
// import AutoSizer from '@oyyds/react-auto-sizer';
import { FC } from 'react';




// interface IListSizingContext {
//     windowWidth: number;
//     setSize: (index: number, size: number) => void;
// }

const messages = (() => {
    return Array(20).fill({}).map(() => (
        {
            id: Math.random().toString(),
            chat: Math.random().toString(),
            user: 'friendId' + Math.random().toString(),
            content: 'amazing message' + Math.random().toString(),
            atttachments: [''],
            isChanged: false,
            isDeleted: false,
            respondOn: [''],
            createdAt: '',
            updatedAt: '',
        } as IMessage
    ));
})();

// const ListSizingContext = createContext<IListSizingContext | undefined>(undefined);

export const MessageList: FC = () => {
    return (
        <div className='h-full'>
            <AutoSizer className='overflow-hidden'>
                {({ height, width }) => (
                    <Scrollbars style={{ width, height }}>
                        <ol className='flex flex-col justify-end min-h-full'>
                            {messages.map((message, index) => {
                                return (
                                    <li 
                                        className='min-h-[80px] hover:bg-message 
                                        focus-visible:bg-message focus-within:bg-message' 
                                        key={message.id}
                                    >
                                        {message.content} 
                                        {
                                            index === 0 
                                                ? <>----- first index</> 
                                                : index === messages.length - 1 
                                                    ? <>------- last index</> 
                                                    : null
                                        }
                                    </li>
                                );
                            })}
                        </ol>
                    </Scrollbars>
                )}
            </AutoSizer>
        </div>
    );
};

// export const MessageList: FC = () => {
//     const listRef = useRef<VariableSizeList<any>| null>(null);
//     const sizeMap = useRef<Record<string, number>>({});

//     const setSize = useCallback((index: number, size: number) => {
//         sizeMap.current = { ...sizeMap.current, [index]: size };
//         listRef.current && listRef.current.resetAfterIndex(index);
//     }, []);

//     const getSize = useCallback((index: number) => {
//         return sizeMap.current[index] || 200;
//     }, []);

//     const { width } = useWindowSize();
//     const contextValues: IListSizingContext = {
//         windowWidth: width,
//         setSize,
//     };

//     return (
//         <>
//             <button onClick={() => {
//                 listRef.current && listRef.current.scrollToItem(messages.length, 'end');
//             }}>
//                 go to the end
//             </button>
//             <div className='h-full'>
//                 <ListSizingContext.Provider value={contextValues}>
//                     <AutoSizer>
//                         {({ height, width }) => (
//                             <VariableSizeList
//                                 className='overflow-x-hidden custom-scrollbar-variant-primary'
//                                 height={height}
//                                 itemCount={messages.length}
//                                 itemSize={getSize}
//                                 estimatedItemSize={150}
//                                 initialScrollOffset={999999}
//                                 width={width}
//                                 ref={listRef}
//                                 innerElementType={'ol'}
//                             >
//                                 {MessageItem}
//                             </VariableSizeList>
//                         )}
//                     </AutoSizer>
//                 </ListSizingContext.Provider>
//             </div>
//         </>
//     );
// };

// const MessageItem: FC<ListChildComponentProps> = ({ index, style }) => {
//     const message = messages[index];
//     const ref = useRef<HTMLLIElement | null>(null);
//     const { setSize, windowWidth } = useContext(ListSizingContext) as IListSizingContext;

//     useEffect(() => {
//         if (!ref.current) return;
//         ref.current.style.height = '';
//         const height = ref.current.getBoundingClientRect().height;
//         ref.current.style.height = style.height + 'px';
//         setSize(index, height);
//     }, [index, setSize, style.height, windowWidth]);

//     return (
//         <li 
//             className='min-h-[80px] hover:bg-message 
//             focus-visible:bg-message focus-within:bg-message'
//             key={message.id}
//             tabIndex={0}
//             style={style}
//             ref={ref}
//         >
//             {message.content} 
//             {
//                 index === 0 
//                     ? <>----- first index</> 
//                     : index === messages.length - 1 
//                         ? <>------- last index</> 
//                         : null
//             }
//         </li>
//     );
// };