import { debounce } from "@lesnoypudge/utils";
import { useMemo } from "react";



export const useDebounce = () => {
    const debounced = useMemo(() => debounce, []);

    return {
        debounced,
    }
}