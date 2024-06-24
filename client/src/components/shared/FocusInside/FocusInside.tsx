import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction, useConst } from '@lesnoypudge/utils-react';
import { isHTMLElement } from '@typeGuards';
import { FOCUSABLE_SELECTOR } from '@vars';
import { 
    FC, PropsWithChildren, RefObject, 
    useCallback, useLayoutEffect, useRef 
} from 'react';



type ConditionalProps = (
    (
        RT.PropsWithRequiredRenderFunction<[{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            wrapperRef: RefObject<any>,
            focusInside: (options?: FocusOptions) => void;
        }]>
        & {
            providedRef?: never;
        }
    ) | (
        PropsWithChildren
        & {
            providedRef: RefObject<HTMLElement>;
        }
    )
);

type FocusInside = ConditionalProps & {
    focused: boolean;
    sync?: boolean;
}

export const FocusInside: FC<FocusInside> = ({
    focused = false,
    sync = false,
    providedRef,
    children,
}) => {
    const ref = useRef<HTMLElement>(null);
    const isFocusAppliedRef = useRef(false);
    const isAsync = useConst(() => !sync)

    const focusInside = useCallback((options?: FocusOptions) => {
        const actualRef = providedRef ?? ref;
        if (!actualRef.current) return;
        
        const target = actualRef.current.querySelector(FOCUSABLE_SELECTOR);
        if (!isHTMLElement(target)) return;

        isFocusAppliedRef.current = true;

        target.focus(options);
    }, [providedRef])

    useLayoutEffect(() => {
        if (!focused) return;

        isFocusAppliedRef.current = false;

        focusInside()

        if (isFocusAppliedRef.current) return;
        if (!isAsync) return;
        
        const observer = new MutationObserver((_, observer) => {
            focusInside();

            if (isFocusAppliedRef.current) {
                observer.disconnect()
            }
        })

        const actualRef = providedRef ?? ref;
        if (!actualRef.current) return;

        observer.observe(actualRef.current, {
            attributes: true,
            childList: true,
            subtree: true,
        });

        return () => observer.disconnect();
    }, [focusInside, focused, isAsync, providedRef]);

    return renderFunction(children, {
        focusInside,
        wrapperRef: ref,
    });
};