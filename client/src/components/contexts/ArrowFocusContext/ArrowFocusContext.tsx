import { PropsWithChildrenAsNodeOrFunction } from '@types';
import React, { createContext, FC, useEffect, useRef, useState } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';



type ProvidedArray = Record<string, any> & {
    id: string;
    // [x: string]: unknown;
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
    list: ProvidedArray;
    direction: 'horizontal' | 'vertical' | 'both';
}

export const ArrowFocusContext = createContext<ArrowFocusContext | undefined>(undefined);

export const ArrowFocusContextProvider: FC<ArrowFocusContextProvider> = ({
    list,
    direction,
    children,
}) => {
    const focusedWithArrow = useRef<boolean>(false);
    const [focus, setFocus] = useState<Focus>({ 
        focusableId: list[0]?.id,
        focusedId: null,
    });

    const getAvailableSteps = () => {
        const length = list.length - 1;
        const currentIndex = list.findIndex((item) => item.id === focus.focusableId);
        
        if (currentIndex === -1) {
            return {
                prev: list[0]?.id,
                next: list[0]?.id,
            };
        }

        const prevIndex = currentIndex === 0 ? length : currentIndex - 1;
        const nextIndex = currentIndex === length ? 0 : currentIndex + 1;

        return {
            prev: list[prevIndex].id,
            next: list[nextIndex].id,
        };
    };

    const handleArrowMove = (e: React.KeyboardEvent) => {
        const isMoveUp = e.code === 'ArrowUp';
        const isMoveRight = e.code === 'ArrowRight';
        const isMoveDown = e.code === 'ArrowDown';
        const isMoveLeft = e.code === 'ArrowLeft';
        const notMove = !isMoveUp && !isMoveRight && !isMoveDown && !isMoveLeft;
        const notHorizontal = direction === 'horizontal' && !isMoveLeft && !isMoveRight;
        const notVertical = direction === 'vertical' && !isMoveUp && !isMoveDown;
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
        const isListFocusable = list.findIndex((item) => item.id === focus.focusableId) !== -1;
        
        if (isListFocusable) return;

        setFocus({ 
            focusableId: list[0]?.id,
            focusedId: null,
        });
    }, [focus.focusableId, list]);

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