import { ObjectWithId } from "@types";
import { RefObject, useState } from "react";



type Options = {
    list: ObjectWithId[],
}

export const useKeyboardNavigationV2 = (
    elementRef: RefObject<HTMLElement>,
    options: Options,
) => {
    // const [isFocusedInside, setIsFocusedInside] = useState(false);
}