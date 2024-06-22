import { renderFunction, useLatest } from "@lesnoypudge/utils-react";
import { RT } from "@lesnoypudge/types-utils-react/namespace";
import { RefObject, useCallback, useLayoutEffect, useRef } from "react";



type RenderProps<_Element> = [{
    focusableRef: RefObject<_Element>;
    focus: (options: FocusOptions) => void;
}]

type ConditionalProps = {
    scrollIntoView: true;
    vertical?: ScrollLogicalPosition;
    horizontal?: ScrollLogicalPosition;
    behavior?: 'auto' | 'smooth';
} | {
    scrollIntoView?: false;
    vertical?: never;
    horizontal?: never;
    behavior?: never;
}

type FocusAtProps<_Element> = RT.PropsWithRenderFunction<
    RenderProps<_Element>
> & ConditionalProps & {
    focused: boolean;
    providedFocusableRef?: RefObject<_Element>;
};

export const FocusAt = <_Element extends HTMLElement>({
    focused,
    providedFocusableRef,
    scrollIntoView = false,
    horizontal,
    vertical,
    behavior,
    children
}: FocusAtProps<_Element>) => {
    const focusableRef = useRef<_Element>(providedFocusableRef?.current ?? null);
    const shouldScrollRef = useLatest(scrollIntoView);
    const scrollOptionsRef = useLatest({
        inline: horizontal,
        block: vertical,
        behavior,
    });

    const focus = useCallback((options?: FocusOptions) => {
        if (!focusableRef.current) return;
        
        focusableRef.current.focus(options ?? {
            preventScroll: false,
            // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#focusvisible
            focusVisible: true,
        });

        if (!shouldScrollRef.current) return;
        
        focusableRef.current.scrollIntoView(scrollOptionsRef.current)
    }, [scrollOptionsRef, shouldScrollRef])
    
    useLayoutEffect(() => {
        if (!focused) return;

        focus()
    }, [focused, focus])

    return renderFunction<RenderProps<_Element>>(children, { 
        focusableRef,
        focus,
    })
}