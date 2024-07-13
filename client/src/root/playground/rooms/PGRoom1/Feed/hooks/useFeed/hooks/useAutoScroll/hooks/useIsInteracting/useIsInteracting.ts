import { RefObject, useState } from "react";
import { useIsFocusInside } from "./hooks";
import { useEventListenerV2 } from "@hooks";



export const useIsInteracting = (elementRef: RefObject<HTMLElement>) => {
    const [isInInteractionMode, setIsInInteractionMode] = useState(false);
    const {isFocusInside} = useIsFocusInside(elementRef)

    const isInteracting = isFocusInside || isInInteractionMode;

    const enableInteractionMode = () => {
        if (isInInteractionMode) return;

        setIsInInteractionMode(true);
    }

    const disableInteractionMode = () => {
        if (!isInInteractionMode) return;

        setIsInInteractionMode(false);
    }

    useEventListenerV2(elementRef, 'touchstart', enableInteractionMode);
    useEventListenerV2(elementRef, 'touchmove', enableInteractionMode);
    useEventListenerV2(elementRef, 'touchend', disableInteractionMode);
    useEventListenerV2(elementRef, 'touchcancel', disableInteractionMode);
    useEventListenerV2(elementRef, 'mouseenter', enableInteractionMode);
    useEventListenerV2(elementRef, 'mouseleave', disableInteractionMode);
    

    return {
        isInteracting
    }
}