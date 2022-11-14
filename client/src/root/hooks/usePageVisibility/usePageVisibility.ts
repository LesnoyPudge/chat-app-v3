import { useEffect } from 'react';



export const usePageVisibility = () => {
    useEffect(() => {
        const handleVisibilityChange = () => {
            const isElement = document.activeElement instanceof HTMLElement;
            const isHidden = document.visibilityState === 'hidden';

            if (isElement && isHidden) {
                const element = document.activeElement as HTMLElement;
                element.blur();
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
};