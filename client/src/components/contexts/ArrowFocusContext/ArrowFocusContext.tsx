import { PropsWithChildrenAsNodeOrFunction } from '@types';
import React, { createContext, FC, useEffect, useMemo, useRef, useState } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';



type ProvidedArray = Record<string, any> & {
    id: string | number;
}[];

type ProvidedObject = Record<string, Record<string, any> & {
    identifier: string;
}>;

type ProvidedList = ProvidedArray | ProvidedObject;

type NormalizedList = Record<string, any> & {
    id: string;
}[];

interface Focus {
    focusableId: string;
    focusedId: string | null;
}

export interface ArrowFocusContext {
    focus: Focus;
    handleArrowMove: (e: React.KeyboardEvent) => void;
    setFocusable: (id: string) => void;
}

interface ArrowFocusContextProvider extends PropsWithChildrenAsNodeOrFunction<ArrowFocusContext> {
    list: ProvidedList;
    orientation: 'horizontal' | 'vertical' | 'both';
    initialId?: string;
}

const normalizeList = (list: ProvidedList): NormalizedList | [] => {
    if (list.length === 0) return list as [];

    return Array.isArray(list) ? (
        list.map((item) => ({
            id: item.id.toString(),
        }))
    ) : (
        Object.values(list).map((item) => ({
            id: item.identifier,
        }))
    );
};

export const ArrowFocusContext = createContext<ArrowFocusContext | undefined>(undefined);

export const ArrowFocusContextProvider: FC<ArrowFocusContextProvider> = ({
    list,
    orientation,
    initialId = '0',
    children,
}) => {
    const normalizedList = useMemo(() => normalizeList(list), [list]);
    const focusedWithArrow = useRef<boolean>(false);
    const [focus, setFocus] = useState<Focus>({ 
        focusableId: normalizedList[parseInt(initialId)]?.id,
        focusedId: null,
    });

    const getAvailableSteps = () => {
        const length = normalizedList.length - 1;
        const currentIndex = normalizedList.findIndex((item) => item.id === focus.focusableId);
        
        if (currentIndex === -1) {
            return {
                prev: normalizedList[0]?.id,
                next: normalizedList[0]?.id,
            };
        }

        const prevIndex = currentIndex === 0 ? length : currentIndex - 1;
        const nextIndex = currentIndex === length ? 0 : currentIndex + 1;

        return {
            prev: normalizedList[prevIndex].id,
            next: normalizedList[nextIndex].id,
        };
    };

    const handleArrowMove = (e: React.KeyboardEvent) => {
        const isMoveUp = e.code === 'ArrowUp';
        const isMoveRight = e.code === 'ArrowRight';
        const isMoveDown = e.code === 'ArrowDown';
        const isMoveLeft = e.code === 'ArrowLeft';
        const notMove = !isMoveUp && !isMoveRight && !isMoveDown && !isMoveLeft;
        const notHorizontal = orientation === 'horizontal' && !isMoveLeft && !isMoveRight;
        const notVertical = orientation === 'vertical' && !isMoveUp && !isMoveDown;
        const isForvard = isMoveDown || isMoveRight;

        if (notMove) return;
        if (notHorizontal) return;
        if (notVertical) return;
        
        const { prev, next } = getAvailableSteps();
        focusedWithArrow.current = true;
        e.preventDefault();

        setFocus({
            focusableId: isForvard ? next : prev,
            focusedId: isForvard ? next : prev,
        });
    };

    const setFocusable = (id: string) => {
        if (focusedWithArrow.current) {
            focusedWithArrow.current = false;
            return;
        }
        
        setFocus({
            focusedId: id,
            focusableId: id,
        });
    };

    useEffect(() => {
        if (!normalizedList.length) return;
        
        const isListFocusable = normalizedList.findIndex((item) => item.id === focus.focusableId) !== -1;

        if (isListFocusable) return;

        setFocus({ 
            focusableId: normalizedList[0]?.id,
            focusedId: null,
        });
    }, [focus.focusableId, normalizedList]);

    const contextValues: ArrowFocusContext = {
        focus,
        handleArrowMove,
        setFocusable,
    };
    
    return (
        <ArrowFocusContext.Provider value={contextValues}>
            <ChildrenAsNodeOrFunction args={contextValues}>
                {children}
            </ChildrenAsNodeOrFunction>
        </ArrowFocusContext.Provider>
    );
};