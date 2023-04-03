import { ObjectWithId, PropsWithChildrenAsNodeOrFunction } from '@types';
import { createContext, FC, KeyboardEventHandler, MutableRefObject, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { ChildrenAsNodeOrFunction, List, Scrollable } from '@components';
import { Key } from 'ts-key-enum';
import { useLatest } from 'react-use';
import { noop, twClassNames } from '@utils';
import { useProvidedValue, useEventListener, useStateAndRef } from '@hooks';
import { useInterval } from 'usehooks-ts';
import SimpleBarCore from 'simplebar-core';
import { ViewportList, ViewportListRef } from 'react-viewport-list';
import { useKeyboardNavigation } from './useKeyboardNavigation';
import { MoveFocusInside } from 'react-focus-lock';



type HandleKeyDown = (e: KeyboardEvent | React.KeyboardEvent) => void

interface KeyboardNavigationContext {
    list: ObjectWithId[];
    // lastFocusableIdRef: MutableRefObject<string | undefined>;
    lastFocusableId: string | undefined;
    focusedId: string | null;
    handleKeyDown: HandleKeyDown;
}

interface KeyboardNavigationContextProvider extends PropsWithChildrenAsNodeOrFunction<KeyboardNavigationContext> {
    list: ObjectWithId[];
    initialFocusableId?: string;
    providedRootElement?: HTMLElement | RefObject<HTMLElement> | null;
    onFocusChange?: (item: ObjectWithId) => void;
}

export const KeyboardNavigationContext = createContext<KeyboardNavigationContext | undefined>(undefined);

export const KeyboardNavigationContextProvider: FC<KeyboardNavigationContextProvider> = ({
    list,
    initialFocusableId,
    providedRootElement,
    children,
    onFocusChange,
}) => {
    const idFallbackRef = useLatest(initialFocusableId || list.at(0)?.id || null);
    // const [focusableList, focusableListRef] = useStateAndRef(list);
    // const [focusableList] = useState(list);
    const [lastFocusableId, setLastFocusableId] = useState<string | undefined>(initialFocusableId || list.at(0)?.id);
    // const [focusedId, setFocusedId] = useState<string | null>(null);
    
    const focusableListRef = useLatest(list);
    const lastFocusableIdRef = useRef(initialFocusableId || list.at(0)?.id);
    // const focusedIdRef = useRef(focusedId);
    const [focusedId, focusedIdRef, setFocusedId] = useStateAndRef<string | null>(null);

    const [rootElement, setRootElement] = useProvidedValue(providedRootElement || null);

    const getCurrentIndex = useCallback(() => {
        return focusableListRef.current.findIndex((item) => item.id === focusedIdRef.current);
    }, [focusableListRef, focusedIdRef]);

    const getIndexById = (id: string) => {
        return focusableListRef.current.findIndex((item) => item.id === id);
    };

    const move = {
        next: () => {
            const currentIndex = getCurrentIndex();
            if (currentIndex === -1) {
                setFocusedId(idFallbackRef.current);

                if (!idFallbackRef.current || !onFocusChange) return;
                const newIndex = getIndexById(idFallbackRef.current);
                onFocusChange(focusableListRef.current[newIndex]);
                return;
            }

            const newIndex = Math.min(
                focusableListRef.current.length - 1, 
                currentIndex + 1,
            );
            setFocusedId(focusableListRef.current[newIndex].id);
            (onFocusChange || noop)(focusableListRef.current[newIndex]);
        },
        previous: () => {
            const currentIndex = getCurrentIndex();
            if (currentIndex === -1) {
                setFocusedId(idFallbackRef.current);
                
                if (!idFallbackRef.current || !onFocusChange) return;
                const newIndex = getIndexById(idFallbackRef.current);
                onFocusChange(focusableListRef.current[newIndex]);
                return;
            }

            const newIndex = Math.max(0, currentIndex - 1);
            setFocusedId(focusableListRef.current[newIndex].id);
            (onFocusChange || noop)(focusableListRef.current[newIndex]);
        },
    };

    const handleKeyDown: HandleKeyDown = (e) => {
        if (!focusableListRef.current.length) return;
        if (e.key === Key.ArrowUp) {
            console.log('up');
            move.previous();
            e.preventDefault();
        }

        if (e.key === Key.ArrowDown) {
            console.log('down');
            move.next();
            e.preventDefault();
        }
    };

    useEffect(() => {
        if (getCurrentIndex() !== -1) return;

        setFocusedId(null);
    }, [getCurrentIndex, list, setFocusedId]);
    
    useEventListener('keydown', handleKeyDown, rootElement);

    const contextValues: KeyboardNavigationContext = {
        list,
        lastFocusableId,
        focusedId,
        handleKeyDown,
    };

    return (
        <KeyboardNavigationContext.Provider value={contextValues}>
            <ChildrenAsNodeOrFunction args={contextValues}>
                {children}
            </ChildrenAsNodeOrFunction>
        </KeyboardNavigationContext.Provider>
    );
};


export const Test: FC = () => {
    const [list, setList] = useState(Array(10).fill(null).map((_, i) => ({
        id: i.toString(),
    })));

    const handleClick = () => setList(prev => [...prev, { id: prev.length.toString() }]);

    // useInterval(handleClick, 2000);

    const [simpleBar, setSimpleBar] = useState<SimpleBarCore | null>(null);
    const [indexes, setIndexes] = useState([0, 0]);
    const virtualList = list.slice(indexes[0], indexes[1] + 1);
    const [viewportList, setViewportList] = useState<ViewportListRef | null>(null);

    const { getIsFocused, getTabIndex } = useKeyboardNavigation(
        virtualList,
        simpleBar?.contentWrapperEl, 
        {
            direction: 'vertical',
            loop: false,
            initialFocusableId: virtualList.at(-1)?.id,
            onFocusChange: (item) => {
                if (!item) return;

                viewportList?.scrollToIndex({
                    index: list.findIndex(listItem => listItem.id === item.id),
                    prerender: virtualList.length,
                    alignToTop: true,
                    offset: -400,
                });
            },
        },
    );

    return (
        <div className='h-full flex flex-col'>
            <button onClick={handleClick}>
                <>add</>
            </button>

            <Scrollable className='' focusable setSimpleBar={setSimpleBar}>
                <ViewportList 
                    items={list}
                    onViewportIndexesChange={setIndexes}
                    ref={setViewportList}
                >
                    {(item) => (
                        <MoveFocusInside
                            key={item.id}
                            disabled={!getIsFocused(item.id)}
                        >
                            <div
                                tabIndex={getTabIndex(item.id)}
                            >
                                {item.id}
                            </div>
                        </MoveFocusInside>
                    )}
                </ViewportList>
            </Scrollable>
        </div>
    );
};


// <KeyboardNavigationContextProvider 
//     list={virtualList}
//     initialFocusableId={virtualList.at(-1)?.id}
//     providedRootElement={simpleBar?.contentWrapperEl}
//     onFocusChange={(item) => {
//         console.log('focus', item);
//         viewportList?.scrollToIndex({
//             index: list.findIndex(listItem => listItem.id === item.id),
//             prerender: virtualList.length,
//             alignToTop: true,
//             offset: -400,
//         });
//     }}
// >
//     {({ lastFocusableId, focusedId, handleKeyDown }) => (
//         <>
//             <div>
//                 <>last: {lastFocusableId}</>
//             </div>

//             <ViewportList 
//                 items={list}
//                 onViewportIndexesChange={setIndexes}
//                 ref={setViewportList}
//             >
//                 {(item) => (
//                     <div 
//                         key={item.id}
//                         className={twClassNames({
//                             'focused': focusedId === item.id,
//                         })}
//                         // onKeyDown={handleKeyDown}
//                         // tabIndex={0}
//                     >
//                         {item.id}
//                     </div>
//                 )}
//             </ViewportList>
//             {/* 
//                             <List list={list}>
                                
//                             </List> */}
//         </>
//     )}
// </KeyboardNavigationContextProvider>;