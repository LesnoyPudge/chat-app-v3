import { ChildrenOrFunction, PropsWithChildrenOrFunction } from '@components';
import React, { createContext, FC, useRef, useState } from 'react';



type GetIndexType = (index: number) => number;

type HandleKeyDownType = (e: React.KeyboardEvent) => void;

interface IListItemLifeCycle {
    onMount: () => void; 
    onUnmount: () => void;
}

export interface IWrapperProps {
    tabIndex: number;
    onKeyDown: HandleKeyDownType;
    onBlur: () => void;
    onFocus: () => void;
}

export interface IFocusableListContext {
    wrapperProps: IWrapperProps;
    listItemLifeCycle: IListItemLifeCycle;
    getTabIndex: GetIndexType;
}

export const FocusableListContext = createContext<IFocusableListContext | undefined>(undefined);

export const FocusableListContextProvider: FC<PropsWithChildrenOrFunction<IFocusableListContext>> = ({ children }) => {
    const listLength = useRef(-1);
    const [currentFocus, setCurrentFocus] = useState<number | null>(null);
    
    const blurTimeoutRef = useRef(0);

    const listItemLifeCycle: IListItemLifeCycle = {
        onMount: () => listLength.current++,
        onUnmount: () => listLength.current--,
    };

    const handleFocus = () => {
        clearTimeout(blurTimeoutRef.current);
    };

    const handleBlur = () => {
        if (currentFocus === null) return;
        blurTimeoutRef.current = setTimeout(() => setCurrentFocus(null));
    };

    const getTabIndex: GetIndexType = (index) => {
        return index === currentFocus ? 0 : -1;
    };

    const handleKeyDown: HandleKeyDownType = (e) => {
        if (e.code === 'ArrowUp') {
            e.preventDefault();
            
            setCurrentFocus((prevFocus) => {
                const emptyList = listLength.current === -1;
                const isNull = prevFocus === null;
                const shouldBeNull = isNull || emptyList;
                const shouldGoToLast = prevFocus === 0;
                const newValue = shouldBeNull ? null : shouldGoToLast ? listLength.current : prevFocus - 1;
                
                return newValue;
            });
        }

        if (e.code === 'ArrowDown') {
            e.preventDefault();

            setCurrentFocus((prevFocus) => {
                const emptyList = listLength.current === -1;
                const isNull = prevFocus === null;
                const lastItem = !isNull && prevFocus >= listLength.current;
                const shouldBeNull = emptyList;
                const shouldBeZero = (isNull && !emptyList) || (!emptyList && lastItem);
                const newValue = shouldBeNull ? null : shouldBeZero ? 0 : prevFocus! + 1;
                
                return newValue;
            });
        }
    };

    const wrapperProps: IWrapperProps = {
        tabIndex: 0,
        onKeyDown: handleKeyDown, 
        onBlur: handleBlur,
        onFocus: handleFocus,
    };

    const contextValues: IFocusableListContext = {
        wrapperProps,
        getTabIndex,
        listItemLifeCycle,
    };

    return (
        <FocusableListContext.Provider value={contextValues}>
            <ChildrenOrFunction childrenOrFunction={children} args={contextValues}/>
        </FocusableListContext.Provider>
    );
};