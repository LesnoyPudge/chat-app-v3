import { FC } from 'react';
import { ErrorBoundary, Loader, Masks } from './components';
import { RootRouter } from './router';
import './styles/main.scss';
import { usePageVisibility, usePreventDefault, useThemeSwitcher } from './hooks';



export const Root: FC = () => {
    usePageVisibility();
    useThemeSwitcher();
    usePreventDefault();

    return (
        <ErrorBoundary>
            <Masks/>

            <Loader>
                <RootRouter/>
            </Loader>
        </ErrorBoundary>
    );
};