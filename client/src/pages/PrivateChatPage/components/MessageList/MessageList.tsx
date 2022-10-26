import { IMessage } from '@backendTypes';
import { useIsFirstRender } from '@hooks';
import { createContext, FC, useCallback, useEffect, useRef } from 'react';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';



interface IListSizingContext {
    setSize: (index: number, size: number) => void;
}

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

const ListSizingContext = createContext<IListSizingContext | undefined>(undefined);

export const MessageList: FC = () => {
    const isFirstRender = useIsFirstRender();
    const scrollWrapperRef = useRef<HTMLDivElement | null>(null);
    const sizeMap = useRef<Record<string, number>>({});
    const setSize = useCallback((index: number, size: number) => {
        sizeMap.current = { ...sizeMap.current, [index]: size };
    }, []);
    const getSize = useCallback((index: number) => sizeMap.current[index] || 100, []);

    useEffect(() => {
        if (!isFirstRender) return;
        if (!scrollWrapperRef.current) return;

        const scrollWrapper = scrollWrapperRef.current;
        scrollWrapper.scrollTo({ top: scrollWrapper.scrollHeight, behavior: 'auto' });

    }, [isFirstRender]);

    const contextValues: IListSizingContext = {
        setSize,
    };

    return (
        <div 
            className='overflow-y-auto h-full' 
            // ref={scrollWrapperRef}
        >
            <ListSizingContext.Provider value={contextValues}>
                <ol className='flex justify-end min-h-full flex-col-reverse'>
                    <AutoSizer >
                        {({ height, width }) => (
                            <VariableSizeList
                                className=''
                                initialScrollOffset={99999}
                                height={height}
                                itemCount={messages.length}
                                itemSize={getSize}
                                estimatedItemSize={200}
                                width={width}
                                innerRef={scrollWrapperRef}
                            // outerRef={scrollWrapperRef}
                            >
                                {MessageItem}
                            </VariableSizeList>
                        )}
                    </AutoSizer>
                </ol>
            </ListSizingContext.Provider>
            
            
            {/* <ol className='flex justify-end min-h-full flex-col-reverse'>
                {
                    messages.map((message) => {
                        return (
                            <li 
                                className='min-h-[80px] hover:bg-message 
                                focus-visible:bg-message focus-within:bg-message'
                                key={message.id}
                                tabIndex={0}
                            >
                                {message.content}
                            </li>
                        );
                    })
                }
            </ol> */}
        </div>
    );
};

const MessageItem: FC<ListChildComponentProps> = ({ index, style }) => {
    const message = messages[index];
    const ref = useRef<HTMLLIElement | null>(null);
    useEffect(() => {
        if (!ref.current) return;
        
    }, []);

    return (
        <li 
            className='min-h-[80px] hover:bg-message 
            focus-visible:bg-message focus-within:bg-message'
            key={message.id}
            tabIndex={0}
            style={style}
            ref={ref}
        >
            {
                message.content} {index === 0 
                ? <>----- first index</> 
                : index === messages.length - 1 
                    ? <>------- last index</> 
                    : null
            }
        </li>
    );
};