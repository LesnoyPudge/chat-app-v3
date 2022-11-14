import { useUserSettings } from '@hooks';
import { useEffect } from 'react';



export const useThemeSwitcher = () => {
    const { setTheme } = useUserSettings();

    const handleKeypress = (e: KeyboardEvent) => {
        if (e.key === '1') setTheme('dark');
        if (e.key === '2') setTheme('light');
        if (e.key === '3') setTheme('auto');
    };

    useEffect(() => {
        document.addEventListener('keypress', handleKeypress);

        return () => {
            document.removeEventListener('keypress', handleKeypress);
        };
    });
};