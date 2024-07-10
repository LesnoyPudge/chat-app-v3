import { throttle as throttleLib } from "@lesnoypudge/utils";
import { useCallback, useMemo } from "react";



export const useThrottleV2 = () => {
    const throttled = useCallback(<
        _Args extends any[],
        _CallBack extends (...args: _Args) => void
    >(callback: _CallBack, delay: number) => {
        return throttleLib(callback, delay)
    }, []);
    
    return {
        throttled
    }
}