


export const debounce = <F extends (...args: never[]) => unknown>(callback: F, delay = 200) => {
    let timeout = 0;

    return (...args: Parameters<F>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback(...args), delay);
    };
};