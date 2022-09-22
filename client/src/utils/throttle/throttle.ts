


export const throttle = <F extends (...args: never[]) => unknown>(callback: F, delay = 200) => {
    let isThrottling = false;
    let lastArgs: Parameters<F> | null = null;

    const timeoutFunc = () => {
        if (lastArgs === null) return isThrottling = false;
        
        callback(...lastArgs);
        lastArgs = null;
        setTimeout(timeoutFunc, delay);
    };
  
    return (...args: Parameters<F>) => {
        if (isThrottling) return lastArgs = args;
  
        callback(...args);
        isThrottling = true;
  
        setTimeout(timeoutFunc, delay);
    };
};