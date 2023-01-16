import { useEventListener } from 'usehooks-ts';



export const useThemeSwitcher = () => {
    const handleKeydown = (e: KeyboardEvent) => {
        const setTheme = (theme: 'auto' | 'light' | 'dark') => {
            document.documentElement.dataset.theme = theme;
        };
        
        if (e.key === '1') setTheme('dark');
        if (e.key === '2') setTheme('light');
        if (e.key === '3') setTheme('auto');
    };

    useEventListener('keydown', handleKeydown);
};