import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction, useConst } from '@lesnoypudge/utils-react';
import { isHTMLElement } from '@typeGuards';
import { FOCUSABLE_SELECTOR } from '@vars';
import { 
    FC,
    PropsWithChildren, RefObject, 
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
    log?: boolean;
    forced?: boolean;
}


const isVisible = (
    container: Element,
    element: Element,
): element is HTMLElement => {
    let _element: Element | null = element;

    while (_element) {
        // if (_element.classList.contains(' hidden ')) return false;
        if (window.getComputedStyle(_element).display === 'none') return false;

        if (_element === container) break;

        _element = _element.parentElement;
    }

    if (_element && !isHTMLElement(_element)) return false;

    return true;
}

const getFocusableElement = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(FOCUSABLE_SELECTOR);
    return Array.from(focusableElements).find((element) => {
        return isVisible(container, element)
    });
}

export const FocusInside: FC<FocusInside> = ({
    focused = false,
    sync = false,
    log = false,
    forced = false,
    providedRef,
    children,
}) => {
    const ref = useRef<HTMLElement>(null);
    
    // useFocusInside(providedRef ?? ref)
  
    // useEventListener('focusin', (e) => {
    //     console.log(e.target)
    // }, document)

    // const container = providedRef?.current ?? ref.current;
    // // console.log('setting attr', focused, container)
    // if (container) {
    //     container.setAttribute(constants.FOCUS_AUTO, String(focused))
    // }
    
    const isFocusAppliedRef = useRef(false);
    const isAsync = useConst(() => !sync)
    
    const focusInside = useCallback((options?: FocusOptions) => {
        const container = providedRef?.current ?? ref.current;
        if (!container) return;
        
        const focusableElement = getFocusableElement(container);
        if (!focusableElement) return;

        isFocusAppliedRef.current = true;
        
        if (log) {
            console.log('focus to', focusableElement)
        }

        focusableElement.focus(options);
    }, [providedRef, log])

    useLayoutEffect(() => {
        if (!focused) return;

        if (
            !forced
            && document.activeElement
            && isVisible(document.body, document.activeElement)
        ) {
            return;
        }

        isFocusAppliedRef.current = false;

        focusInside()

        if (isFocusAppliedRef.current) return;
        if (!isAsync) return;
        
        if (log) {
            console.log('mount observer')
        }

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
    }, [focusInside, focused, isAsync, providedRef, log]);

    return renderFunction(children, {
        focusInside,
        wrapperRef: ref,
    });
};