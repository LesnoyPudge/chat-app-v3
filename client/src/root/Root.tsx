import { useUserSettings } from '@hooks';
import { store } from '@redux/store';
import { customBlur } from '@utils';
import { FC, lazy, Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import { Masks } from './components';
// import { useOutline } from './hooks';
import { RootRouter } from './router';
import './styles/main.scss';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from '@pages/ErrorPage';



export const Root: FC = () => {
    // useOutline();

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') customBlur();
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <>
            {/* <Provider store={store}> */}
            {/* <div id='app-root'> */}
            <Masks/>
            
            <ErrorBoundary FallbackComponent={ErrorPage}>
                <RootRouter/>
            </ErrorBoundary>
            
            {/* </div> */}

            {/* <div id='overlay-root'></div> */}

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