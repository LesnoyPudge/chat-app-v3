import { useState } from 'react';



type UseToggleType = (initialState?: boolean, secondState?: boolean) => [
    state: boolean, 
    toggle: () => void,
    set: (nextState: boolean) => void,
];

export const useToggle: UseToggleType = (initialState = false) => {
    const [state, setState] = useState(initialState);

    const toggle = () => setState(prev => !prev);
    const set = (nextState: boolean) => setState(nextState);

    return [
        state,
        toggle,
        set,    
    ];
};