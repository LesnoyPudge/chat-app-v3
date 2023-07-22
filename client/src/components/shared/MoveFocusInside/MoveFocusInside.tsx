import { isHTMLElement } from '@typeGuards';
import { PropsWithChildrenAndClassName } from '@types';
import { focusableSelector } from '@vars';
import { FC, useEffect, useRef } from 'react';



interface MoveFocusInside extends PropsWithChildrenAndClassName {
    enabled?: boolean;
}

export const MoveFocusInside: FC<MoveFocusInside> = ({
    className = '',
    enabled = false,
    children,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!enabled) return;
        if (!ref.current) return;

        const wrapper = ref.current;
        const target = wrapper.querySelector(focusableSelector);

        if (!isHTMLElement(target)) return;

        target.focus();
    }, [enabled]);


    return (
        <div className={className} ref={ref}>
            {children}
        </div>
    );
};