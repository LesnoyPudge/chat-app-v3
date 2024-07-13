import { RefObject, useState } from "react";
import { useFocusVisibleWithinEvent } from "@hooks";


 
export const useIsFocusInside = (
    scrollableRef: RefObject<HTMLElement>,
) => {
    const [isFocusInside, setIsFocusInside] = useState(false);

    useFocusVisibleWithinEvent(
        () => setIsFocusInside(true), 
        () => setIsFocusInside(false),
        scrollableRef,
    )
    
    return {
        isFocusInside
    }
}