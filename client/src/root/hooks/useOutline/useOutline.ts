import { useEventListener } from '@hooks';
import { getHTML } from '@utils';
import { useEffect } from 'react';



const outline = document.createElement('div');
const modalRoot = getHTML().overlay;
// modalRoot.append(outline);

export const useOutline = () => {
    const onFocusIn = (e: FocusEvent) => {
        // return;
        // (e.target as HTMLElement).getBoundingClientRect()
        // return;
        // console.log(e, e.target);
        return;
        const target = e.target as HTMLElement;
        const targetRect = target.getBoundingClientRect();
        const targetStyle = window.getComputedStyle(target);

        outline.style.width = targetRect.width + 'px';
        outline.style.height = targetRect.height + 'px';
        // outline.style.outlineWidth = '4px';
        // outline.style.outlineColor = '#00aff4';
        // outline.style.outlineStyle = 'solid';
        outline.className = 'focused';
        outline.style.borderRadius = targetStyle.borderRadius;
        outline.style.position = 'fixed';
        outline.style.top = Math.max(targetRect.top, 4) + 'px';
        outline.style.left = Math.max(targetRect.left, 4) + 'px';
        console.log('create');
        modalRoot.append(outline);
    };

    const onFocusOut = () => {
        return;
        console.log('focus out');
        // outline.className = '';
        outline.remove();
    };

    useEventListener('focusin', onFocusIn, document);
    useEventListener('focusout', onFocusOut, document);
};