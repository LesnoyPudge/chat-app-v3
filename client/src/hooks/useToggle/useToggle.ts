import { useState } from 'react';



export const useToggle = (initialState = false) => {
    const [state, setState] = useState(initialState);

    const toggle = (nextState?: boolean) => {
        if (nextState) return setState(nextState);
        setState(prev => !prev);
    };

    return {
        state,
        toggle,
    };
};