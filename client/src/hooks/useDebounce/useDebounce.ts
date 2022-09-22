import { useRef, useState } from 'react';



export const useDebounce = () => {
    const [isDebouncing, setIsDebouncing] = useState(false);
    const timeout = useRef(0);

    const debounce = <F extends (...args: never[]) => unknown>(callback: F, delay = 200) => {
        
    
        return (...args: Parameters<F>) => {
            setIsDebouncing(true);
            clearTimeout(timeout.current);

            timeout.current = setTimeout(() => {
                setIsDebouncing(false);
                callback(...args);
            }, delay);
        };
    };

    return {
        debounce,
        isDebouncing,
    };
};