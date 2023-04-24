import { useEventListener, useProvidedValue, useStateAndRef, useThrottle } from '@hooks';
import { ObjectWithId } from '@types';
import { noop } from '@utils';
import { RefObject, useCallback, useMemo } from 'react';
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
    focusableListRef: RefObject<ObjectWithId[]>,
    providedRoot: RootElement = null,
    options?: Options,
): UseKeyboardNavigationReturn => {
    const {
        direction = 'vertical',
        loop = false,
        initialFocusableId,
        onFocusChange = noop,
    } = options || {};

    const [root, setRoot] = useProvidedValue(providedRoot);
    const initialIdRef = useLatest(initialFocusableId || focusableListRef.current?.at(0)?.id || null);
    const [_, focusedIdRef, setFocusedId] = useStateAndRef<string | null>(null);
    const { isThrottling, throttle } = useThrottle();

    const getCurrentIndexRef = useLatest(() => {
        if (!focusableListRef.current) return -1;

        return focusableListRef.current.findIndex((item) => (
            item.id === focusedIdRef.current ||
            item.id === initialIdRef.current
        ));
    });

    const getIndexesRef = useLatest(() => {
        const currentIndex = getCurrentIndexRef.current();
        const listLength = focusableListRef.current?.length || 0;

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
    });

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
        
        const isEmptyList = !focusableListRef.current?.length;

        if (isEmptyList) return;
        if (isThrottling) return;

        throttle(noop, 0)();

        const noFocusedId = focusedIdRef.current === null && initialIdRef.current === null;
        const isItemInArray = focusableListRef.current.some((item) => (
            item.id === focusedIdRef.current || 
            item.id === initialIdRef.current
        ));

        const moveDirection = isForward ? 'forward' : 'backward';

        if ((noFocusedId || !isItemInArray) && isEmptyList) return;

        if ((noFocusedId || !isItemInArray) && !isEmptyList) {
            const item = focusableListRef.current.find((item) => item.id === initialIdRef.current);

            setFocusedId(initialIdRef.current);
            onFocusChange(item, moveDirection, focusedIdRef);

            return;
        }

        const { nextIndex, prevIndex } = getIndexesRef.current();
        const newIndex = isForward ? nextIndex : prevIndex;
        const newItem = focusableListRef.current[newIndex];

        if (focusedIdRef.current === newItem.id) return;

        setFocusedId(newItem.id);
        onFocusChange(newItem, moveDirection, focusedIdRef);
    }, root);

    const getTabIndex = useCallback((id: string) => {
        const isInitial = id === initialIdRef.current && !focusedIdRef.current;
        return (id === focusedIdRef.current || isInitial) ? 0 : -1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    } , []);

    const result: UseKeyboardNavigationReturn = useMemo(() => ({
        getIsFocused: (id) => id === focusedIdRef.current,
        getTabIndex,
        setRoot,
        setFocusedId,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

    return result;
};