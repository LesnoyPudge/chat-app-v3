import { useEventListener, useProvidedValue, useStateAndRef, useThrottle } from '@hooks';
import { ObjectWithId } from '@types';
import { noop } from '@utils';
import { MutableRefObject, RefObject, useCallback, useMemo } from 'react';
import { useLatest } from 'react-use';
import { Key } from 'ts-key-enum';



type RootElement = RefObject<HTMLElement> | HTMLElement | null;

interface Options {
    direction?: 'horizontal' | 'vertical';
    loop?: boolean;
    initialFocusableId?: string;
    onFocusChange?: (
        item: ObjectWithId | undefined, 
        stepType: 'forward' | 'backward',
        focusedIdRef: RefObject<string | null>,
    ) => void;
}

interface UseKeyboardNavigationReturn {
    getIsFocused: (id: string) => boolean;
    getTabIndex: (id: string) => number;
    setRoot: React.Dispatch<React.SetStateAction<RootElement>>;
    setFocusedId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useKeyboardNavigation = (
    focusableListRef: MutableRefObject<ObjectWithId[]>,
    providedRoot: RootElement = null,
    options?: Options,
): UseKeyboardNavigationReturn => {
    const {
        direction = 'vertical',
        loop = true,
        initialFocusableId,
        onFocusChange = noop,
    } = options || {};

    const [root, setRoot] = useProvidedValue(providedRoot);
    const initialIdRef = useLatest(initialFocusableId || focusableListRef.current.at(0)?.id || null);
    const [_, focusedIdRef, setFocusedId] = useStateAndRef<string | null>(null);
    const { isThrottling, throttle } = useThrottle();
 
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
        const key = e.key;

        const isForward = key === Key.ArrowDown || key === Key.ArrowRight;
        const isBackward = key === Key.ArrowUp || key === Key.ArrowLeft;

        if (!isForward && !isBackward) return;

        const isHorizontalMove = key === Key.ArrowLeft || key === Key.ArrowRight;
        const isVerticalMove = !isHorizontalMove;

        if (direction === 'horizontal' && !isHorizontalMove) return;
        if (direction === 'vertical' && !isVerticalMove) return;
        
        e.preventDefault();

        if (!focusableListRef.current.length) return;
        if (isThrottling) return;

        throttle(noop, 0)();

        const noFocusedId = focusedIdRef.current === null;
        const isItemInArray = focusableListRef.current.some((item) => item.id === focusedIdRef.current);

        if ((noFocusedId || !isItemInArray) && !focusableListRef.current.length) return;

        if ((noFocusedId || !isItemInArray) && !!focusableListRef.current.length) {
            const item = focusableListRef.current.find((item) => item.id === initialIdRef.current);

            setFocusedId(initialIdRef.current);
            onFocusChange(item, isForward ? 'forward' : 'backward', focusedIdRef);

            return;
        }

        const { nextIndex, prevIndex } = getIndexes();
        const newIndex = isForward ? nextIndex : prevIndex;
        const newItem = focusableListRef.current[newIndex];

        if (focusedIdRef.current === newItem.id) return;

        setFocusedId(newItem.id);
        onFocusChange(newItem, isForward ? 'forward' : 'backward', focusedIdRef);
    }, root);

    const result: UseKeyboardNavigationReturn = useMemo(() => ({
        getIsFocused: (id) => id === focusedIdRef.current,
        getTabIndex: (id) => id === focusedIdRef.current ? 0 : -1,
        setRoot,
        setFocusedId,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

    return result;
};