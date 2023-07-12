import { useEventListener } from 'usehooks-ts';



export const useDebug = () => {
    const handleKeydown = (e: KeyboardEvent) => {
        const toggleDebug = () => {
            const currentValue = document.documentElement.dataset.debug as 'false' | 'true';
            document.documentElement.dataset.debug = currentValue === 'false' ? 'true' : 'false';

            if (currentValue === 'false') {
                console.log(`${document.querySelectorAll('*').length} DOM elements`);
            }
        };

        if (e.key === '4') toggleDebug();
    };

    useEventListener('keydown', handleKeydown);
};