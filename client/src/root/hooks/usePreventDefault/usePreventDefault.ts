import { useEffect } from 'react';



export const usePreventDefault = () => {
    useEffect(() => {
        const preventDefault = (e: Event) => {
            e.preventDefault();
        };

        document.addEventListener('contextmenu', preventDefault);
    
        return () => {
            document.removeEventListener('contextmenu', preventDefault);
        };
    }, []);
};