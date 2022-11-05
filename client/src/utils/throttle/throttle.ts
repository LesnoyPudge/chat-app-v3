


export const throttle = <F extends (...args: never[]) => void>(callback: F, delay = 200) => {
    let isThrottling = false;
    let lastArgs: Parameters<F> | null = null;
    let calledDuringThrottle = false;

    const timeoutFunc = () => {
        if (!calledDuringThrottle) {
            isThrottling = false;
            lastArgs = null;
            return;
        }
        
        callback(...lastArgs || []);
        lastArgs = null;
        calledDuringThrottle = false;
        setTimeout(timeoutFunc, delay);
    };
  
    return (...args: Parameters<F>): void => {
        if (isThrottling) {
            lastArgs = args;
            calledDuringThrottle = true;
            return;
        }

        isThrottling = true;
        callback(...args);
        setTimeout(timeoutFunc, delay);
    };
};