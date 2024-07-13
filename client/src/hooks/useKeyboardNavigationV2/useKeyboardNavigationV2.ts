import { useEventListenerV2, useLatest, useNamedState } from "@hooks";
import { ObjectWithId } from "@types";
import { RefObject, useCallback } from "react";
import { hotKey, KEY } from "@lesnoypudge/utils";



type Direction = 'vertical' | 'horizontal';
type MoveDirection = 'forward' | 'backward';

type onFocusChangeItem = {
    id: string,
    index: number,
}

type Options = {
    list: ObjectWithId[];
    direction: Direction;
    loop: boolean;
    initialFocusedId?: string;
    onFocusChange?: (value: {
        prev?: onFocusChangeItem;
        next: onFocusChangeItem;
        moveDirection: MoveDirection;
        prevent: () => void;
    }) => void;
}

// forward moves ↓→
// backward moves ←↑ 

const forwardMovementHotKey = hotKey.make(
    [KEY.ArrowDown],
    [KEY.ArrowRight],
    [KEY.D],
    [KEY.S],
);

const backwardMovementHotKey = hotKey.make(
    [KEY.ArrowUp],
    [KEY.ArrowLeft],
    [KEY.A],
    [KEY.W],
);

const eventOptions: hotKey.HotKeyOptions = {
    prevent: true,
    stop: true,
}

export const useKeyboardNavigationV2 = (
    elementRef: RefObject<HTMLElement>,
    providedOptions: Options,
) => {
    const optionsRef = useLatest(providedOptions);
    const {
        currentFocusedId,
        currentFocusedIdRef,
        setCurrentFocusedId,
    } = useNamedState('currentFocusedId', () => (
        optionsRef.current.initialFocusedId
        ?? optionsRef.current.list.at(0)?.id
    ));
    const {
        isInitializedRef,
        setIsInitialized,
    } = useNamedState('isInitialized', false)

    const getPossibleIndexes = (currentIndex: number) => {
        const listLength = optionsRef.current.list.length;
        if (listLength === 1) return {
            nextIndex: currentIndex,
            prevIndex: currentIndex,
        }

        const loop = optionsRef.current.loop;

        if (!loop) {
            const nextIndex = Math.min(listLength - 1, currentIndex + 1);
            const prevIndex = Math.max(0, currentIndex - 1);

            return {
                nextIndex,
                prevIndex,
            };
        }

        const nextIndex = (
            currentIndex === listLength - 1 
                ? 0 
                : currentIndex + 1
        );
        const prevIndex = (
            currentIndex === 0 
                ? listLength - 1 
                : currentIndex - 1
        );

        return {
            nextIndex,
            prevIndex,
        };
    };

    const changeFocus = (
        moveDirection: MoveDirection,
        prevItem: onFocusChangeItem | undefined, 
        nextItem: onFocusChangeItem
    ) => {
        let bail = false;

        const prevent = () => {
            bail = true;
        }
        
        optionsRef.current.onFocusChange?.({
            prev: prevItem,
            next: nextItem,
            moveDirection,
            prevent,
        });

        if (bail) return;

        setIsInitialized(true);
        setCurrentFocusedId(nextItem.id);
    }

    const move = (moveDirection: MoveDirection) => {
        const list = optionsRef.current.list;
        if (!list.length) return;

        const isForward = moveDirection === 'forward';

        const currentIndex = list.findIndex((item) => {
            return item.id === currentFocusedId;
        });
        const isValidId = !!currentFocusedId && currentIndex !== -1;

        if (!isValidId) {
            const newId = (
                optionsRef.current.initialFocusedId
                ?? list[0].id
            );
            const newIndex = list.findIndex((item) => item.id === newId);

            changeFocus(moveDirection, undefined, {
                id: newId,
                index: newIndex,
            })

            return;
        }

        const { nextIndex, prevIndex } = getPossibleIndexes(currentIndex);
        const newIndex = isForward ? nextIndex : prevIndex;
        const newItem = list[newIndex];

        changeFocus(moveDirection, {
            id: currentFocusedId,
            index: currentIndex,
        }, {
            id: newItem.id,
            index: newIndex,
        })
    }

    useEventListenerV2(elementRef, 'keydown', (e) => {
        if (forwardMovementHotKey(
            () => move('forward'), 
            eventOptions
        )(e)) return;
        backwardMovementHotKey(() => move('backward'), eventOptions)(e);
    })

    const getTabIndex = useCallback((id: string) => {
        return id === currentFocusedIdRef.current ? 0 : -1;
    }, [])

    const getIsFocused = useCallback((id: string) => {
        if (!isInitializedRef.current) return false;
        return id === currentFocusedIdRef.current;
    }, [])

    const withFocusSet = useCallback((id: string, cb: CallableFunction) => {
        return () => {
            setCurrentFocusedId(id);
            cb();
        };
    }, []);

    return {
        getTabIndex,
        getIsFocused,
        withFocusSet,
    }
}