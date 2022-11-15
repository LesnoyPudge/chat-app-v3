import { useEffect, useState } from 'react';



type UseConditionalType = <T, F>(trueState: T, falseState: F, condition?: boolean) => [
    state: T | F, 
    getState: (condition: boolean) => T | F
];

export const useConditional: UseConditionalType = (trueState, falseState, condition = true) => {
    const [state, setState] = useState(condition ? trueState : falseState);

    useEffect(() => {
        setState(condition ? trueState : falseState);
    }, [condition, falseState, trueState]);

    const getState = (condition: boolean) => {
        return condition ? trueState : falseState;
    };

    return [
        state,
        getState,
    ];
};