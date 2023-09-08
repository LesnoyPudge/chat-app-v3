import { useState, useMemo, useEffect } from 'react';
import { useLatest } from '@hooks';



type Actions<T> = {
    add: (value: T) => void;
    has: (value: T) => boolean;
    remove: (value: T) => void;
    reset: () => void;
    toggle: (value: T) => void;
}

export const useSet = <T,>(initial?: Iterable<T> | null): [Set<T>, Actions<T>] => {
    const [set, setSet] = useState(new Set(initial));
    const initialRef = useLatest(initial);
    const latestSet = useLatest(set);

    const actions = useMemo<Actions<T>>(() => ({
        add: (value) => {
            setSet((prev) => new Set([...prev, value]));
        },

        has: (value) => latestSet.current.has(value),

        remove: (value) => {
            setSet((prev) => new Set([...prev].filter((v) => v !== value)));
        },

        reset: () => {
            setSet(new Set(initialRef.current));
        },

        toggle: (value) => {
            setSet((prev) => {
                if (prev.has(value)) {
                    return new Set([...prev].filter((v) => v !== value));
                }

                return new Set([...prev, value]);
            });
        },
    }), [initialRef, latestSet]);

    return [
        set,
        actions,
    ];
};