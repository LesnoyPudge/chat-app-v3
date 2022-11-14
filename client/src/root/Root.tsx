import { FC } from 'react';
import { Masks } from './components';
import { RootRouter } from './router';
import './styles/main.scss';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from '@pages/ErrorPage';
import { usePageVisibility, usePreventDefault, useThemeSwitcher } from './hooks';



export const Root: FC = () => {
    usePageVisibility();
    useThemeSwitcher();
    usePreventDefault();

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

            {/* </Provider> */}
        </>
    );
};