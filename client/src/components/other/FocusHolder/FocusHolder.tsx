import { conditional } from '@utils';
import { FC, PropsWithChildren, useLayoutEffect, useRef, useState } from 'react';



export const FocusHolder: FC<PropsWithChildren> = ({
    children,
}) => {
    const [shouldHoldFocus, setShouldHoldFocus] = useState(true);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const tabIndex = conditional(0, -1, shouldHoldFocus);

    useLayoutEffect(() => {
        if (!wrapperRef.current) return;

        const wrapper = wrapperRef.current as HTMLDivElement;
        const focusableElementsSelector = 'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
        const tabableElements = wrapper.querySelectorAll(focusableElementsSelector);
        const newShouldHoldFocus = !tabableElements.length;
        setShouldHoldFocus(newShouldHoldFocus);
    }, []);

    return (
        <div
            className='focus-hidden'
            tabIndex={tabIndex} 
            ref={wrapperRef}
        >
            {children}
        </div>
    );
};