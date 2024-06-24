import { renderFunction, useLatest } from "@lesnoypudge/utils-react";
import { RT } from "@lesnoypudge/types-utils-react/namespace";
import { FC, RefObject, useCallback, useLayoutEffect, useRef } from "react";



type RenderProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    focusableRef: RefObject<any>;
    focus: (options: FocusOptions) => void;
}

type ConditionalScrollOptions = {
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

type ConditionalRef = (
    RT.PropsWithRequiredRenderFunction<[RenderProps]>
    & {
        providedRef?: never;
    }
) | (
    RT.PropsWithRenderFunctionOrNode<[Pick<RenderProps, 'focus'>]>
    & {
        providedRef: RefObject<HTMLElement>;
    }
);

type FocusAt = (
    ConditionalRef
    & ConditionalScrollOptions
    & {
        focused: boolean;
    }
);

export const FocusAt: FC<FocusAt> = ({
    focused,
    providedRef,
    scrollIntoView = false,
    horizontal,
    vertical,
    behavior,
    children
}) => {
    const focusableRef = useRef<HTMLElement>(null);
    const shouldScrollRef = useLatest(scrollIntoView);
    const scrollOptionsRef = useLatest({
        inline: horizontal,
        block: vertical,
        behavior,
    });

    const focus = useCallback((options?: FocusOptions) => {
        const actualRef = providedRef ?? focusableRef;
        if (!actualRef.current) return;
        
        actualRef.current.focus(options ?? {
            preventScroll: false,
            // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#focusvisible
            focusVisible: true,
        });

        if (!shouldScrollRef.current) return;
        
        actualRef.current.scrollIntoView(scrollOptionsRef.current)
    }, [providedRef, scrollOptionsRef, shouldScrollRef])
    
    useLayoutEffect(() => {
        if (!focused) return;

        focus()
    }, [focused, focus])

    return renderFunction(children, { 
        focusableRef,
        focus,
    })
}