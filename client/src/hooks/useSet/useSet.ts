import { useState, useRef } from 'react';
import { useLatest } from '@hooks';



type Actions<T> = {
    add: (value: T) => void;
    has: (value: T) => boolean;
    remove: (value: T) => void;
    reset: () => void;
    toggle: (value: T) => void;
}

type ArrayReturn<T> = [Set<T>, Actions<T>];

type ObjectReturn<T> = {
    _value: Set<T>;
    _actions: Actions<T>;
};

type UseSetReturn<T> = ArrayReturn<T> & ObjectReturn<T>;

export const useSet = <T,>(initial?: Iterable<T> | null): UseSetReturn<T> => {
    const [set, setSet] = useState(new Set(initial));
    const latestSet = useLatest(set);

    const actionsRef = useRef<Actions<T>>({
        add: (value) => {
            setSet((prev) => new Set([...prev, value]));
        },

        has: (value) => latestSet.current.has(value),

        remove: (value) => {
            setSet((prev) => new Set([...prev].filter((v) => v !== value)));
        },

        reset: () => {
            setSet(new Set(initial));
        },

        toggle: (value) => {
            setSet((prev) => {
                if (prev.has(value)) {
                    return new Set([...prev].filter((v) => v !== value));
                }

                return new Set([...prev, value]);
            });
        },
    });

    const arr: ArrayReturn<T> = [set, actionsRef.current];
    const obj: ObjectReturn<T> = { _value: set, _actions: actionsRef.current };

    return Object.assign(arr, obj);
};