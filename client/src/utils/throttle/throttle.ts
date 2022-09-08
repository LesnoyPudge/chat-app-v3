


export const throttle = <F extends (...args: never[]) => unknown>(callback: F, delay: number) => {
    let isBlocked = false;
    let timeout = 0;

    const throttled = (...args: Parameters<F>) => {
        if (!isBlocked) {
            isBlocked = true;
            callback(...args);
            setTimeout(() => isBlocked = false, delay);
            return;
        }

        isBlocked = true;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callback(...args);
            isBlocked = false;
        }, delay);
    };

    return throttled as (...args: Parameters<F>) => ReturnType<F>;
};