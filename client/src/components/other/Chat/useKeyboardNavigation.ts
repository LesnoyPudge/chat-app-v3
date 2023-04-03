import { useEventListener, useProvidedValue, useStateAndRef } from '@hooks';
import { ObjectWithId } from '@types';
import { noop } from '@utils';
import { RefObject, useCallback, useEffect } from 'react';
import { useLatest } from 'react-use';
import { Key } from 'ts-key-enum';



type RootElement = RefObject<HTMLElement> | HTMLElement | null;

interface Options {
    direction?: 'horizontal' | 'vertical';
    loop?: boolean;
    initialFocusableId?: string;
    onFocusChange?: (item?: ObjectWithId) => void;
}

interface UseKeyboardNavigationReturn {
    getIsFocused: (id: string) => boolean;
    getTabIndex: (id: string) => number;
    setRoot: React.Dispatch<React.SetStateAction<RootElement>>,
}

export const useKeyboardNavigation = (
    list: ObjectWithId[],
    providedRoot: RootElement = null,
    options?: Options,
): UseKeyboardNavigationReturn => {
    const {
        direction = 'vertical',
        loop = true,
        initialFocusableId,
        onFocusChange = noop,
    } = options || {};

    const focusableListRef = useLatest(list);
    const [root, setRoot] = useProvidedValue(providedRoot);
    const initialIdRef = useLatest(initialFocusableId || list.at(0)?.id || null);
    const [_, focusedIdRef, setFocusedId] = useStateAndRef<string | null>(null);

    const getCurrentIndex = useCallback(() => {
        return focusableListRef.current.findIndex((item) => item.id === focusedIdRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getIndexes = useCallback(() => {
        const currentIndex = getCurrentIndex();
        const listLength = focusableListRef.current.length;

        if (!loop) {
            const nextIndex = Math.min(listLength - 1, currentIndex + 1);
            const prevIndex = Math.max(0, currentIndex - 1);

            return {
                nextIndex,
                prevIndex,
            };
        }

        const nextIndex = currentIndex === listLength - 1 ? 0 : currentIndex + 1;
        const prevIndex = currentIndex === 0 ? listLength - 1 : currentIndex - 1;

        return {
            nextIndex,
            prevIndex,
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loop]);

    useEventListener('keydown', (e) => {
        if (!focusableListRef.current.length) return;

        const key = e.key;
        const isForward = key === Key.ArrowDown || key === Key.ArrowRight;
        const isBackward = key === Key.ArrowUp || key === Key.ArrowLeft;

        if (!isForward && !isBackward) return;

        const isHorizontalMove = key === Key.ArrowLeft || key === Key.ArrowRight;
        const isVerticalMove = !isHorizontalMove;

        if (direction === 'horizontal' && !isHorizontalMove) return;
        if (direction === 'vertical' && !isVerticalMove) return;
        

        e.preventDefault();

        if (focusedIdRef.current === null) {
            setFocusedId(initialIdRef.current);
            onFocusChange(focusableListRef.current.find((item) => item.id === initialIdRef.current));
            return;
        }

        const { nextIndex, prevIndex } = getIndexes();
        const newIndex = isForward ? nextIndex : prevIndex;
        const newItem = focusableListRef.current[newIndex];
        
        if (focusedIdRef.current === newItem.id) return;

        setFocusedId(newItem.id);
        onFocusChange(newItem);
    }, root);

    useEffect(() => {
        if (getCurrentIndex() !== -1) return;

        setFocusedId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    const result: UseKeyboardNavigationReturn = {
        getIsFocused: (id) => id === focusedIdRef.current,
        getTabIndex: (id) => id === focusedIdRef.current ? 0 : -1,
        setRoot,
    };

    return result;
};