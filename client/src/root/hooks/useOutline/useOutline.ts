import { useEffect } from 'react';



export const useOutline = () => {
    const outline = document.createElement('div');

    const onFocusIn = (e: FocusEvent) => {
        console.log(e);
        const target = e.target as HTMLElement;
        const targetRect = target.getBoundingClientRect();
        const targetStyle = window.getComputedStyle(target);
        const modalRoot = document.getElementById('modal-root') as HTMLElement;
        outline.style.width = targetRect.width + 'px';
        outline.style.height = targetRect.height + 'px';
        outline.style.outlineWidth = '4px';
        outline.style.outlineColor = '#00aff4';
        outline.style.outlineStyle = 'solid';
        outline.style.borderRadius = targetStyle.borderRadius;
        outline.style.position = 'fixed';
        outline.style.top = targetRect.top + 'px';
        outline.style.left = targetRect.left + 'px';
        modalRoot.append(outline);
    };

    const onFocusOut = () => {
        outline.remove();
    };

    useEffect(() => {
        document.addEventListener('focusin', onFocusIn);
        document.addEventListener('focusout', onFocusOut);

        return () => {
            document.removeEventListener('focusin', onFocusIn);
            document.removeEventListener('focusout', onFocusOut);
        };
    }, []);
};