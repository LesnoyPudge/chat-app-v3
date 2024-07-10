import { RefObject, useState } from "react";
import { useDebounced } from "../useDebounced/useDebounced";
import { useFocusVisibleWithinEvent } from "@hooks";


 
export const useIsFocusInside = (
    scrollableRef: RefObject<HTMLElement>,
) => {
    const [isFocusInside, setIsFocusInside] = useState(false);
    
    // const debouncedSetState = useDebounced(setIsFocusInside, 100)
    
    useFocusVisibleWithinEvent(
        () => setIsFocusInside(true), 
        () => setIsFocusInside(false),
        scrollableRef,
    )
    
    return {
        isFocusInside
    }
}