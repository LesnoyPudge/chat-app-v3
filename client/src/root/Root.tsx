import { useUserSettings } from '@hooks';
import { store } from '@redux/store';
import { FC, useEffect } from 'react';
import { Provider } from 'react-redux';
import { RootRouter } from './router';
import './styles/main.scss';



export const Root: FC = () => {
    // const outline = document.createElement('div');

    // const onFocusIn = (e: FocusEvent) => {
    //     const target = e.target as HTMLElement;
    //     const targetRect = target.getBoundingClientRect();
    //     const targetStyle = window.getComputedStyle(target);
    //     const modalRoot = document.getElementById('modal-root');
    //     outline.style.width = targetRect.width + 'px';
    //     outline.style.height = targetRect.height + 'px';
    //     outline.style.outlineWidth = '4px';
    //     outline.style.outlineColor = '#00aff4';
    //     outline.style.outlineStyle = 'solid';
    //     outline.style.borderRadius = targetStyle.borderRadius;
    //     outline.style.position = 'fixed';
    //     outline.style.top = targetRect.top + 'px';
    //     outline.style.left = targetRect.left + 'px';
    //     modalRoot?.append(outline);
    // };

    // const onFocusOut = () => {
    //     outline.remove();
    // };

    // document.addEventListener('focusin', onFocusIn);
    // document.addEventListener('focusout', onFocusOut);

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