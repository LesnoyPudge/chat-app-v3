import { useUserSettings } from '@hooks';
import { store } from '@redux/store';
import { FC, useEffect } from 'react';
import { Provider } from 'react-redux';
import { RootRouter } from './router';
import './styles/main.scss';



export const Root: FC = () => {
    return (
        <>
            {/* <Provider store={store}> */}
            <div id='app-root'>
                <RootRouter/>
            </div>

            <div id='modal-root'>
            
            </div>

            <ThemeSwithcer/>
            {/* </Provider> */}
        </>
    );
};

const ThemeSwithcer: FC = () => {
    const { setTheme } = useUserSettings();
    const keys = ['1', '2', '3'];

    const handleKeypress = (e: KeyboardEvent) => {
        if (!keys.includes(e.key)) return;
        
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

    return (
        <> 
        </>
    );
};