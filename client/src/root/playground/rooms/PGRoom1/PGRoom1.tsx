import { useAnimationFrame, useEventListener, useEventListenerV2, useKeyboardNavigation, useLatest, useResizeObserver, useTimeout } from "@hooks";
import { inRange, noop } from "@lesnoypudge/utils";
import { FC, PropsWithChildren, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ViewportList, ViewportListRef } from "react-viewport-list";
import { ScrollableV2 } from "src/dev/WIP/ScrollableV2";
import { useInterval } from "usehooks-ts";
import { ListChildComponentProps, VariableSizeList } from 'react-window';
import { useAutoScroll } from "./useAutoScroll";



const List: FC<{count: number, prefix?: string}> = ({count, prefix}) => {
    return Array(count).fill('').map((_, i) => {
        return (
            <div key={i}>
                <>{prefix} item {i}</>
            </div>
        )
    })
}

export const PGRoom1: FC = () => {
    const [resizable, setResizable] = useState(300);
    const [newCount, setNewCount] = useState(0);

    useInterval(() => {
        // setResizable(inRange(250, 400));
    }, 1000)

    useInterval(() => {
        // setNewCount((prev) => prev + 1)
    }, 500)

    useTimeout(() => {
        location.reload()
    }, 3 * 60 * 1000)

    const list = [
        ...Array(resizable).fill('').map((_, i) => ({
            id: `resizable-${i}`
        })),
        ...Array(newCount).fill('').map((_, i) => ({
            id: `new-${i}`
        })),
    ]

    return (
        <>
            <AutoScrollable list={list}>
                <List count={resizable} prefix="resizable"/>

                <List count={newCount} prefix="new"/>

                {/* {({}) => (
                    
        
                    <div>
                        <>last item</>
                    </div>
                )} */}
            </AutoScrollable>

            <button onClick={() => setNewCount((prev) => prev + 1)}>
                <>add item</>
            </button>
        </>
    )
}

type AutoScrollable = (
    PropsWithChildren
    & {
        list: {id: string}[];
    }
)

import { useVirtualizer } from '@tanstack/react-virtual'
import { cn } from "@utils";
import { FocusAt } from "@components";
import { mergeRefs } from "@lesnoypudge/utils-react";
import { useAutoScrollV2 } from "./useAutoScrollV2/useAutoScrollV2";
import { useKeyboardNavigationV2 } from "./useKeyboardNavigationV2/useKeyboardNavigationV2";
import { useInfiniteScroll } from "./useInfiniteScroll/useInfiniteScroll";

// rename to FeedScrollable
const AutoScrollable: FC<AutoScrollable> = ({
    children,
}) => {
    // const [list, setList] = useState(Array(50).fill('').map((_, i) => ({
    //     id: `${Date.now()}-item-${i}`
    // })))

    const contentRef = useRef<HTMLDivElement>(null);
    const scrollableRef = useRef<HTMLDivElement>(null)
    const placeholderWrapperRef = useRef<HTMLDivElement>(null)

    const {
        showIntroduction,
        showPlaceholders,
        list,
    } = useInfiniteScroll(scrollableRef, placeholderWrapperRef)
    
    const {
        shouldAutoScroll,
        scrollToBottom,
    } = useAutoScrollV2(scrollableRef);

    const virtualizer = useVirtualizer({
        count: list.length,
        getScrollElement: () => scrollableRef.current,
        estimateSize: () => 100,
        getItemKey: (index) => list[index].id,
        overscan: 3,
    })
    
    const items = virtualizer.getVirtualItems()
    const viewportListRef = useRef<ViewportListRef>(null)
    const {
        getIsFocused,
        getTabIndex,
    } = useKeyboardNavigationV2(contentRef, {
        list: list,
        loop: false,
        direction: 'vertical',
        initialFocusedId: list.at(-1)?.id,
        onFocusChange: ({next}) => {
            viewportListRef.current?.scrollToIndex({
                index: next.index,
            })
        },
    })

    

    return (
        <div className="h-[90dvh] flex flex-col">
            <If condition={false}>
                <ScrollableV2 
                    className="h-full contain-strict"
                    withOppositeGutter
                    direction="vertical"
                    innerRef={scrollableRef}
                >
                    <div
                        // ref={setRoot}
                        ref={contentRef}
                        tabIndex={0}
                        className="relative"
                        style={{
                            height: virtualizer.getTotalSize(),
                        }}
                    >
                        <div
                            className="will-change-transform absolute top-0 left-0 w-full"
                            style={{
                                transform: `translateY(${items[0]?.start ?? 0}px)`,
                            }}
                        >
                            <div className="hidden h-[500px] bg-slate-800">
                                <>placeholder</>
                            </div>

                            {items.map((item) => (
                                <FocusAt 
                                    key={item.key} 
                                    focused={getIsFocused(String(item.key))} 
                                    // scrollIntoView
                                    // vertical="center"
                                >
                                    {(({focusableRef}) => (
                                        <div     
                                            data-index={item.index}
                                            data-key={item.key}
                                            ref={mergeRefs(
                                                virtualizer.measureElement,
                                                focusableRef,
                                            )}
                                            tabIndex={getTabIndex(String(item.key))}
        
                                        >
                                            <div>{list[item.index].id}</div>
                                        </div>
                                    ))}
                                </FocusAt>
                            ))}
                        </div>
                    </div>
                </ScrollableV2>
            </If>

            <If condition={false}>
                <ScrollableV2 
                    className=""
                    direction="vertical"
                    withOppositeGutter
                    innerRef={scrollableRef}
                >
                    <div
                        style={{
                            height: virtualizer.getTotalSize(),
                            // width: '100%',
                            position: 'relative',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                transform: `translateY(${items[0]?.start ?? 0}px)`,
                            }}
                        >
                            {items.map((virtualRow) => (
                                <div
                                    key={virtualRow.key}
                                    data-index={virtualRow.index}
                                    ref={virtualizer.measureElement}
                                    className={
                                        virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'
                                    }
                                >
                                    <div style={{ padding: '10px 0' }}>
                                        <div>Row {virtualRow.index}</div>
                                        <div>{list[virtualRow.index].id}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollableV2>
            </If>

            <If condition={true}>
                <ScrollableV2 
                    className="grow flex flex-col"
                    direction="vertical"
                    withOppositeGutter
                    innerRef={scrollableRef}
                >
                    <div 
                        ref={contentRef} 
                        tabIndex={0}
                    >
                        <If condition={showIntroduction}>
                            <div>introduction</div>
                        </If>

                        <If condition={showPlaceholders}>
                            <div ref={placeholderWrapperRef}>
                                <>placeholders...</>
                            </div>
                        </If>

                        <ViewportList
                            viewportRef={scrollableRef}
                            items={list}
                            overscan={3}
                            // itemMargin={0}
                            indexesShift={list.length}
                            axis='y'
                            ref={viewportListRef}
                            // initialIndex={list.length - 1}
                            // initialPrerender={20}
                            // withCache
                            // scrollThreshold={0}
                            
                            // ref={setViewportList}
                            // onViewportIndexesChange={setViewportIndexes}
                            

                            // getItemBoundingClientRect={}
                            // initialAlignToTop
                            // initialDelay={}
                            // initialIndex={}
                            // initialOffset={}
                            // initialPrerender={}
                            // itemSize={}
                            // onViewportIndexesChange={}
                            // overflowAnchor=""
                            // ref={}
                            // renderSpacer={}
                            // scrollThreshold={}
                            // withCache
                        >
                            {(item) => (
                                <FocusAt 
                                    key={item.id} 
                                    focused={getIsFocused(item.id)} 
                                    scrollIntoView
                                    vertical="center"
                                >
                                    {(({focusableRef}) => (
                                        <div
                                            ref={mergeRefs(
                                                // virtualizer.measureElement,
                                                focusableRef,
                                            )}
                                            tabIndex={getTabIndex(item.id)}
        
                                        >
                                            <div>{item.id}</div>
                                        </div>
                                    ))}
                                </FocusAt>
                            )}
                        </ViewportList>
                            
                        <div>
                            <>last item</>
                        </div>
                    </div>
                </ScrollableV2>
            </If>
            
            <button onClick={scrollToBottom}>
                <>to bottom</>
            </button>
            
            <div>
                <div>data</div>
                <div>shouldAutoScroll: {String(shouldAutoScroll)}</div>
            </div>
        </div>
    )
}