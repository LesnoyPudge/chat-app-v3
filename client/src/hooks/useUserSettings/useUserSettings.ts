import { IUserSettings } from '@backendTypes';
import { useEffect } from 'react';
import { useAppSelector } from '../useAppSelector';



export const useUserSettings = () => {
    // const settings = useAppSelector(selectUserSettings);
    const html = document.getElementsByTagName('html')[0];

    const setTheme = (theme: 'auto' | 'light' | 'dark') => {
        html.dataset.theme = theme;
    };

    return { 
        setTheme, 
    };
};